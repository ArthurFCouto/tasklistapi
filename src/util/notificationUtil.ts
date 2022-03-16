import { myEmitter } from "../app/middlewares/notification";
import Notification from "../database/models/notification";
import logger from "../logger";

class NotificationUtil {

    async SaveNotification(title: string, message: string, userId: number) {
        try {
            await Notification.create({ title, message, userId });
            myEmitter.emit('new_notification');
        } catch (error) {
            logger.error(error);
        }
    }
}

export default new NotificationUtil();