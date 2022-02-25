"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(//Configurações do formato dos logs
    winston_1.default.format.errors({
        stack: true
    }), winston_1.default.format.json() //Será registrado em formato Json
    ),
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
//Se estiver em ambiente diferente do de produção, o erro também aparecerá no console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
exports.default = logger;
