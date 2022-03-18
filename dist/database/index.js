"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const { Sequelize } = require("sequelize");
const url = process.env.NODE_ENV == 'production' ? process.env.DATABASE_URL : 'postgres://postgres@localhost:5432/tasklist';
const obj = process.env.NODE_ENV == 'production' ? {
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
} : {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'Arthur16',
    database: 'tasklist',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
const database = new Sequelize(url, obj);
database
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => {
    logger_1.default.error(err);
    console.error("Unable to connect to the database:", err);
});
exports.default = database;
