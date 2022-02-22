import { DataTypes } from 'sequelize';
import database from '..';
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
    image_perfil: {
        type: DataTypes.STRING
    }
});

//Create table if not exists...
const init = async () => {
    try {
        await User.sync({
            alter: true
        });
    } catch (error) {
        logger.error(error);
    }
};

init();

export default User;