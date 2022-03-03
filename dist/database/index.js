"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Sequelize } = require("sequelize");
const url = process.env.NODE_ENV == 'production' ? process.env.DATABASE_URL : 'postgres://postgres@localhost:5432/tasklist';
//Production environment
const database = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
//Check connection (optional)
database
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.error("Unable to connect to the database:", err));
exports.default = database;
