const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    const newConversations = [];
    while (conversations.length > 0) {
      const convo = conversations.pop();
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for unread messages count and most recently read message
      let latestMessageId = 0;
      convoJSON.unreadMessageCount = 0;
      convoJSON.messages.forEach((message) => {
        if (message.read) {
          latestMessageId = message.id;
        } else if (message.senderId !== userId) {
          convoJSON.unreadMessageCount += 1;
        }
      });
      //sets latest message preview text using the latest message id
      convoJSON.latestMessageReadId = latestMessageId;
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      newConversations.push(convoJSON);
    }
    res.json(newConversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;