import { myEmitter } from "../../app/controllers/NotificationController";
import Notification from "../../database/models/notification";
import logger from "../../logger";
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

    async getFullNotifications() {
        return await Notification.findAll();
    }

    async getNotifications(userId: number) {
        return await Notification.findAll({
            where: { userId }
        });
    }

    async getLastNotification() {
        const notifications: Array<TypeNotification> = await this.getFullNotifications();
        if (notifications.length > 0) {
            const notificationOrdered = this.sortNotifications("id", notifications);
            return notificationOrdered[notifications.length - 1];
        }
    }

    async updateNotification(userId: number, id: number) {
        const notification = await Notification.findByPk(id);
        if (notification && notification.userId === userId) {
            return await notification.update({
                read: true
            });
        }
    }

    async deleteNotification(userId: number, id: number) {
        const notification = await Notification.findByPk(id);
        if (notification && notification.userId === userId) {
            return await notification.destroy();
        }
    }

    async saveNotification(title: string, message: string, userId: number) {
        try {
            await Notification.create({ title, message, userId });
            myEmitter.emit('new_notification');
        } catch (error) {
            logger.error(error);
        }
    }
}

export default new NotificationService();