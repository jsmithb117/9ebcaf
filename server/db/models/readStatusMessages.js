const Sequelize = require("sequelize");
const db = require("../db");

//Sequelize sets and gets all required properties
const ReadStatusMessages = db.define("read_status_messages", {
});


ReadStatusMessages.findReadStatuses = async function (messageId) {
  const readStatuses = await ReadStatusMessages.findAll({
    where: { messageId: messageId },
  });

  return readStatuses;
}
module.exports = ReadStatusMessages;
