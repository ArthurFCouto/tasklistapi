import logger from "../logger";
import Config from "../app/config";

const { Sequelize } = require("sequelize");
const { database: databaseConfig } = Config;

const database = new Sequelize(databaseConfig.url, databaseConfig.obj);

//Opicional
database
    .authenticate()
    .then(() => console.log("A conexão foi estabelecida com sucesso."))
    .catch((err: any) => {
        logger.error(err);
        console.error("Não foi possível conectar ao banco de dados: ", err)
    });

export default database;