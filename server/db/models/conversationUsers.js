const Sequelize = require("sequelize");
const db = require("../db");

//Sequelize sets and gets all required properties
const ConversationUsers = db.define("conversation_user", {});

ConversationUsers.findConversationUsers = async function (conversationId) {
  const conversationUsersQuery = await ConversationUsers.findAll({
    where: {
      conversationId
    }
  });
  const conversationUsers = [];
  conversationUsersQuery.forEach(conversationUser => {
    conversationUsers.push(conversationUser.userId);
  });

  return conversationUsers.length > 0 ? conversationUsers : null;
};

module.exports = ConversationUsers;
