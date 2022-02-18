import { DataTypes } from "sequelize";

import database from "..";
import User from "./user";

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
        await Task.sync();
        //await database.sync({force: true});
        console.log('Succession in creating Task <> User relationship');
    } catch (error) {
        console.log(error);
    }
};

init();

export default Task;