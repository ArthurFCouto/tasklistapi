"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Biblioteca para trabalhar com logs
const winston_1 = __importDefault(require("winston"));
//Criação do logger
const logger = winston_1.default.createLogger({
    //Configurações do formato dos logs: Incluirá o stacktrace e será registrado em formato Json
    format: winston_1.default.format.combine(winston_1.default.format.errors({
        stack: true
    }), winston_1.default.format.json()),
    //Configurando o destino dos logs (arquivos). Será utilizado o mesmo arquivo mas os logs serão separados por tipo
    transports: [
        new winston_1.default.transports.File({
            filename: 'logs/logs.log',
            level: 'error'
        }),
        new winston_1.default.transports.File({
            filename: 'logs/logs.log',
            level: 'info'
        }),
    ],
});
//Se não estiver no ambiente de produção, o erro também aparecerá no console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
exports.default = logger;
