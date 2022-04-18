import { Response } from 'express';
import logger from '../../logger';
import Config from '../config';
import NotificationService, { TypeNotification } from '../service/NotificationService';
const events = require('events');
export const myEmitter = new events.EventEmitter();

class NotificationController {

    getRealTime(req: any, res: Response) {
        const { headerEventStream } = Config;
        const userId = req.userId;
        res.writeHead(200, headerEventStream);
        try {
            myEmitter.on('new_notification', async () => {
                const notification = await NotificationService.getLastNotification();
                if (notification?.userId === userId) {
                    const data = {
                        id: notification?.id,
                        title: notification?.title,
                        message: notification?.message
                    };
                    res.write(`data: ${JSON.stringify(data)}\n\n`);
                }
            });
        } catch (error) {
            logger.error(error);
            return res.write(`data: { "error" : "Erro interno no servidor. Tente mais tarde." } \n\n`);
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
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }

    async update(req: any, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Por favor, verifique se os dados foram enviados corretamente.' });
        try {
            const notification = await NotificationService.updateNotification(req.userId, id);
            if (!notification)
                return res.status(404).json({ error: 'Notificação não encontrada.' });
            return res.json(notification);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }

    async delete(req: any, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Por favor, verifique se os dados foram enviados corretamente.' });
        try {
            const notification = await NotificationService.deleteNotification(req.userId, id, req.role);
            if (!notification)
                return res.status(404).json({ error: 'Notificação não encontrada.' });
            return res.status(200).end();
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }

    async listFull(req: any, res: Response) {
        console.log(req);
        try {
            const notifications = NotificationService.sortNotifications("id", await NotificationService.getFullNotifications());
            return res.json(notifications);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor. Tente mais tarde.' });
        }
    }
}

export default new NotificationController();