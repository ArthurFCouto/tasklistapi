const databaseUrl = process.env.NODE_ENV == 'production' ? process.env.DATABASE_URL : 'postgres://postgres@localhost:5432/tasklist';
const databaseObj = process.env.NODE_ENV == 'production' ?
    {
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    } :
    {
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
    }

export default {
    roles: {
        admin: "admin",
        user: "user",
    },
    port: process.env.PORT || 3030,
    headerEventStream: {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        //'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
    },
    database: {
        url: databaseUrl,
        obj: databaseObj,
    }
}