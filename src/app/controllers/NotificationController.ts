import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/user';
import logger from '../../logger';
import Config from '../config';
import NotificationService, { TypeNotification } from '../service/NotificationService';
const events = require('events');
export const myEmitter = new events.EventEmitter();
const { headerEventStream } = Config;

class NotificationController {

    async getLast(req: Request, res: Response, next: NextFunction) {
        res.writeHead(200, headerEventStream);
        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                const [, token] = authHeader.split(' ');
                const decoded = Object(await jwt.verify(token, String(process.env.JWT_SECRET)));
                const user = await User.findByPk(decoded.id);
                if (user) {
                    myEmitter.on('new_notification', async () => {
                        const notification = await NotificationService.getLastNotification(decoded.id);
                        const data = {
                            title: notification?.title,
                            message: notification?.message
                        };
                        res.write(`data: ${JSON.stringify(data)}\n\n`);
                    });
                } else
                    return res.write(`data: { error: Token user not found, invalid token }`);
            } catch (error) {
                logger.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        } else {
            return res.status(401);
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