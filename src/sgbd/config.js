require("dotenv").config();
const { Sequelize } = require("sequelize");

const myDB = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
    port: process.env.DB_PORT,
    logging: console.log,  }
);

myDB.authenticate()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((error) => console.error("❌ Database connection failed:", error));

module.exports = myDB;
