import winston from "winston";

const logger = winston.createLogger({ //Criação do logger
    format: winston.format.combine( //Configurações do formato dos logs
        winston.format.errors({ //Incluirá o stacktrace
            stack: true
        }),
        winston.format.json() //Será registrado em formato Json
    ),
    transports: [ //O destino dos logs (arquivos)
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

//Se estiver em ambiente diferente do de produção, o erro também aparecerá no console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

export default logger;