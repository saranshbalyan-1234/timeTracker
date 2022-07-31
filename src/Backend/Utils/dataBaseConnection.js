const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASS,

  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    // logging: false
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("sequalize connected");
  })
  .catch((err) => {
    console.log("Sequalize Error", err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.Car = require("./Models/Car")(sequelize, DataTypes);
db.users = require("../Models/User")(sequelize, DataTypes);
db.tracking = require("../Models/Tracking")(sequelize, DataTypes);
db.sequelize
  .sync({
    force: false,
    // mathc:regex // delete tables of matched database
  })
  .then(() => {
    console.log("Sequelize Synced ");
  });

module.exports = db;
