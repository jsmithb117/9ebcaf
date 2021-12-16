const Sequelize = require("sequelize");
const db = require("../db");

//Sequelize sets and gets all required properties
const ReadStatus = db.define("read_status", {});

module.exports = ReadStatus;
