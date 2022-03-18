import logger from "../logger";
import Config from "../app/config";

const { database: databaseConfig } = Config;
const { Sequelize } = require("sequelize");

const database = new Sequelize(databaseConfig.url, databaseConfig.obj);

database
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err: any) => {
        logger.error(err);
        console.error("Unable to connect to the database:", err)
    });

export default database;