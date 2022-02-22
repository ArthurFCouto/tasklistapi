import { DataTypes } from 'sequelize';
import database from '..';
import User from './user';
import logger from '../../logger';

const Task = database.define('task', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false
    },
    check: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
});

const init = async () => {
    try {
        Task.belongsTo(User, {
            constraint: true,
            foreignkey: 'user_id'
        });
        await Task.sync({
            alter: true
        });
    } catch (error) {
        logger.error(error);
    }
};

init();

export default Task;