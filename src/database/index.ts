//Modelo HEROKU
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

//Check connection (optional)
sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err: any) => console.error("Unable to connect to the database:", err));

export default sequelize;