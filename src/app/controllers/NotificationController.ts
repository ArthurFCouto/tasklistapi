import { Request, Response, NextFunction } from 'express';
import logger from '../../logger';
import Config from '../config';
import NotificationService, { TypeNotification } from '../service/NotificationService';
const events = require('events');
export const myEmitter = new events.EventEmitter();
const { headerEventStream } = Config;

class NotificationController {

    getLast(req: any, res: Response, next: NextFunction) {
        //const { userId } = req.params;
        const userId = req.userId;
        res.writeHead(200, headerEventStream);
        try {
            myEmitter.on('new_notification', async () => {
                const notification = await NotificationService.getLastNotification(userId);
                const data = {
                    title: notification?.title,
                    message: notification?.message
                };
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async list(req: any, res: Response) {
        const { read } = req.query;
        const userId = req.userId;
        try {
            const notifications = NotificationService.sortNotifications("id", await NotificationService.getNotifications(userId));
            if (read && notifications.length > 0) {
                return res.json(notifications.filter((notification: TypeNotification) => {
                    if (String(notification.read) === String(read))
                        return notification;
                }));
            };
            return res.json(notifications);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async update(req: any, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Please check the submitted fields' });
        try {
            const notification = await NotificationService.updateNotification(req.userId, id);
            if (!notification)
                return res.status(404).json({ error: 'Notification not found' });
            return res.json(notification);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async delete(req: any, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Please check the submitted fields' });
        try {
            const notification = await NotificationService.deleteNotification(req.userId, id);
            if (!notification)
                return res.status(404).json({ error: 'Notification not found' });
            return res.status(200).end();
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async getAll(req: any, res: Response) {
        try {
            const notifications = NotificationService.sortNotifications("id", await NotificationService.getFullNotifications());
            return res.json(notifications);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }
}

export default new NotificationController();