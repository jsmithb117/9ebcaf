const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ReadStatus = require("./readStatus");
const Group = require("./group");

// associations

Conversation.hasMany(Message);
Conversation.hasMany(User);
Message.belongsTo(Conversation);
Message.belongsToMany(ReadStatus, { through: "message_read" });
ReadStatus.belongsTo(Message, { through: "message_read" });
User.hasMany(Message);
User.hasMany(ReadStatus);
Group.belongsTo(Conversation);
Conversation.hasOne(Group);
Group.belongsToMany(User, { through: "group_user" });
User.hasMany(Group);

module.exports = {
  User,
  Conversation,
  Message,
  ReadStatus,
  Group,
};
