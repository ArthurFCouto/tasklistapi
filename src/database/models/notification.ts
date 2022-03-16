import { DataTypes } from 'sequelize';
import database from '..';
import User from './user';
import logger from '../../logger';

const Notification = database.define('notification', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

const init = async () => {
    try {
        Notification.belongsTo(User, {
            constraint: true,
            foreignkey: 'user_id'
        });
        await Notification.sync({
            alter: true
        });
    } catch (error) {
        logger.error(error);
    }
};

init();

export default Notification;