//Biblioteca para trabalhar com logs
import winston from "winston";

//Criação do logger
const logger = winston.createLogger({
    //Configurações do formato dos logs: Incluirá o stacktrace e será registrado em formato Json
    format: winston.format.combine(
        winston.format.errors({
            stack: true
        }),
        winston.format.json()
    ),
    //Configurando o destino dos logs (arquivos). Será utilizado o mesmo arquivo mas os logs serão separados por tipo
    transports: [
        new winston.transports.File({
            filename: 'logs/logs.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/logs.log',
            level: 'info'
        }),
    ],
});

//Se não estiver no ambiente de produção, o erro também aparecerá no console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

export default logger;