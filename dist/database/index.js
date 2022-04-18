"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const config_1 = __importDefault(require("../app/config"));
const { Sequelize } = require("sequelize");
const { database: databaseConfig } = config_1.default;
const database = new Sequelize(databaseConfig.url, databaseConfig.obj);
//Opicional
database
    .authenticate()
    .then(() => console.log("A conexão foi estabelecida com sucesso."))
    .catch((err) => {
    logger_1.default.error(err);
    console.error("Não foi possível conectar ao banco de dados: ", err);
});
exports.default = database;
