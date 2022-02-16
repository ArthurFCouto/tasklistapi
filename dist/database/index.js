"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Modelo HEROKU
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
//Check connection (optional)
sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.error("Unable to connect to the database:", err));
exports.default = sequelize;
