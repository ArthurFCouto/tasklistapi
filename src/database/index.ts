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
//Check connection (optional)
database
    .authenticate()
    .then(() => console.log("Connection has been established successfully. Environment: " + process.env.NODE_ENV))
    .catch((err: any) => console.error("Unable to connect to the database:", err));

export default database;