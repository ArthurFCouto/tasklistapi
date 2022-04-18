const databaseOptions = process.env.NODE_ENV == 'production'
    ? {
        url: process.env.DATABASE_URL,
        obj: {
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        }
    }
    : {
        url: 'postgres://postgres@localhost:5432/tasklist',
        obj: {
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
    }

export default {
    roles: {
        admin: 'admin',
        user: 'user',
    },
    port: process.env.PORT || 3030,
    headerEventStream: {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    },
    database: {
        url: databaseOptions.url,
        obj: databaseOptions.obj,
    }
}