const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ReadStatus = require("./readStatus");
const ConversationUsers = require("./conversationUsers");
const ReadStatusMessages = require("./readStatusMessages");

// associations

User.hasMany(ReadStatus);
User.hasMany(Message);
Message.belongsTo(User);
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
User.belongsToMany(Conversation, { through: ConversationUsers, foreignKey: 'userId' });
Conversation.belongsToMany(User, { through: ConversationUsers, foreignKey: 'conversationId' });
ReadStatus.belongsTo(User);
ReadStatus.belongsToMany(Message, { through: ReadStatusMessages, foreignKey: 'readStatusId' });
Message.belongsToMany(ReadStatus, { through: ReadStatusMessages, foreignKey: 'messageId' });

module.exports = {
  User,
  Conversation,
  Message,
  ReadStatus,
  ConversationUsers,
  ReadStatusMessages,
};
