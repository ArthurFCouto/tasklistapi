import { myEmitter } from "../../app/controllers/NotificationController";
import Notification from "../../database/models/notification";
import logger from "../../logger";
import Config from "../config";

const { roles } = Config;

type order = "id" | "createdAt" | "read";

export type TypeNotification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
};

class NotificationService {
    sortNotifications(order: order, notification: Array<TypeNotification>) {
        if (notification.length > 0) {
            switch (order) {
                case "id":
                    notification.sort((prev: TypeNotification, next: TypeNotification) => prev.id === next.id ? 0 : prev.id > next.id ? 1 : -1)
                    break;
                case "createdAt":
                    notification.sort((prev: TypeNotification, next: TypeNotification) => prev.createdAt === next.createdAt ? 0 : prev.createdAt > next.createdAt ? 1 : -1)
                    break;
                case "read":
                    notification.sort((prev: TypeNotification, next: TypeNotification) => prev.read === next.read ? 0 : prev.read > next.read ? 1 : -1)
                    break;
            }
        }
        return notification;
    }

    async getFullNotifications(): Promise<Array<TypeNotification>> {
        return await Notification.findAll();
    }

    async getNotifications(userId: number): Promise<Array<TypeNotification>>  {
        return await Notification.findAll({
            where: { userId }
        });
    }

    async getLastNotification(): Promise<TypeNotification | undefined> {
        const notifications = await this.getFullNotifications();
        if (notifications.length > 0) {
            const notificationOrdered = this.sortNotifications("id", notifications);
            return notificationOrdered[notifications.length - 1];
        }
    }

    async updateNotification(userId: number, id: number): Promise<TypeNotification | undefined>  {
        const notification = await Notification.findByPk(id);
        if (notification != null && notification.userId === userId) {
            return await notification.update({
                read: true
            });
        }
    }

    async deleteNotification(userId: number, id: number, role: string): Promise<TypeNotification | undefined>  {
        const notification = await Notification.findByPk(id);
        if (notification != null && (notification.userId === userId || role === roles.admin))
            return await notification.destroy();
    }

    async saveNotification(title: string, message: string, userId: number, role: string): Promise<void> {
        try {
            const notifications = await this.getNotifications(userId);
            if(notifications.length >= 10) 
                await this.deleteNotification(userId, notifications[0].id, role);
            await Notification.create({ title, message, userId });
            myEmitter.emit('new_notification');
        } catch (error) {
            logger.error(error);
        }
    }
}

export default new NotificationService();