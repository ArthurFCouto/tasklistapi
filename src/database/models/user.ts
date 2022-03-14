import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import database from '..';
import { role_admin, role_user } from '../../app/config/roles';
import logger from '../../logger';

const User = database.define('user', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        //allowNull: false
    }
});

//Create table if not exists...
const init = async () => {
    try {
        await User.sync({
            alter: true
        });
        await User.findAll()
        .then((users: any) =>
        {
            for(let user of users) {
                user.update({ role: role_user});
            }
        });
        await User.create({
            name: "Admin",
            email: "admin@admin.com",
            password_hash: await bcrypt.hash("admin123", 8),
            role: role_admin
        });
    } catch (error) {
        logger.error(error);
    }
};

init();

export default User;