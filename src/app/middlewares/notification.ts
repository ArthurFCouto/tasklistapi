import { NextFunction, Response } from 'express';
import Notification from '../../database/models/notification';
import logger from '../../logger';
const events = require('events');
export const myEmitter = new events.EventEmitter();

const header = {
    'Content-Type': 'text/event-stream',
    'Connection': 'heep-alive',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
};

const notificationMiddleware = (req: any, res: Response, next: NextFunction) => {
    //Header setado para informar que é um SSE e para não gardar cache
    res.writeHead(200, header);
    try {
        myEmitter.on('new_notification', async () => {
            const notification = await Notification.findAll({
                where: {
                    userId: req.userId
                }
            })
                .then((list: any) => list.sort((prev: any, next: any) => prev.id === next.id ? 0 : prev.id > next.id ? 1 : -1));
            const data = {
                title: notification[notification.length - 1].title,
                message: notification[notification.length - 1].message
            };
            res.write(JSON.stringify(data) + '\n\n');
        });
    } catch (error) {
        logger.error(error);
    }
}

export default notificationMiddleware;