import { DataTypes } from "sequelize";

import database from "..";

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
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        //allowNull: false
    }
});

const init = async () => {
    await Task.sync();
};

init();

export default Task;