import { Request, Response } from 'express';
import Notification from '../../database/models/notification';
import logger from '../../logger';

type TypeNotification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
};

const notification_model = (notification: TypeNotification) => {
    return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        userId: notification.userId
    };
};

class NotificationController {
    notify(req: Request, res: Response) {
        return res.send("Notifications");
    }

    async list(req: any, res: Response) {
        const { read } = req.query;
        try {
            const notification = await Notification.findAll({
                where: {
                    userId: req.userId
                }
            })
                .then((list: any) =>
                    list.map((notification: TypeNotification) => {
                        return notification_model(notification);
                    }).sort((x: TypeNotification, y: TypeNotification) => x.createdAt === y.createdAt ? 0 : x.createdAt > y.createdAt ? 1 : -1)
                );
            if (read && notification.length > 0) {
                return res.json(notification.filter((notification: TypeNotification) => {
                    if (String(notification.read) == String(read))
                        return notification;
                }));
            };
            return res.json(notification);
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
            const notification = await Notification.findOne({
                where: {
                    id: id,
                    userId: req.userId
                }
            });
            if (!notification)
                return res.status(404).json({ error: 'Notification not found' });
            await notification.update({
                read: true
            });
            return res.json(notification_model(notification));
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
            const notification = await Notification.findOne({
                where: {
                    id: id,
                    userId: req.userId
                }
            });
            if (!notification)
                return res.status(404).json({ error: 'Notification not found' });
            await notification.destroy();
            return res.json(notification_model(notification));
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }
}

export default new NotificationController();