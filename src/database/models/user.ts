import { DataTypes } from 'sequelize';
import database from '..';

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
        console.log(error);
    }
};

init();

export default User;