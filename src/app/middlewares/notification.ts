import { NextFunction, Response } from 'express';
import Notification from '../../database/models/notification';
import logger from '../../logger';
const events = require('events');
export const myEmitter = new events.EventEmitter();

const notificationMiddleware = async (req: any, res: Response, next: NextFunction) => {
    //Header setado para informar que é um SSE e para não gardar cache
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'heep-alive'
    });
    try {
        const notification = await Notification.findAll({
            where: {
                userId: 2
            }
        })
            .then((list: any) => list.sort((x: any, y: any) => x.id === y.id ? 0 : x.id > y.id ? 1 : -1));
        myEmitter.on('new_notification', () => {
            res.write("{\nevent: notification\n");
            res.write("title: " + notification[notification.length - 1].title);
            res.write("message: " + notification[notification.length - 1].message);
            res.write("\n}\n");
        });
    } catch (error) {
        logger.error(error);
    }
}

export default notificationMiddleware;