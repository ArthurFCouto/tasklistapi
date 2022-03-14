import logger from "../logger";

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
    .catch((err: any) => {
        logger.error(err);
        console.error("Unable to connect to the database:", err)
    });

export default database;