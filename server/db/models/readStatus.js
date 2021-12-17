const Sequelize = require("sequelize");
const db = require("../db");

//Sequelize sets and gets all required properties
const ReadStatus = db.define("read_status", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = ReadStatus;
