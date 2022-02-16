import { DataTypes } from "sequelize";

import sequelize from "..";

const User = sequelize.define('user', {
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.BOOLEAN,
    password_hash: DataTypes.STRING
});

//Create table if not exists...
const init = async () => {
    await User.sync();
};

init();

export default User;