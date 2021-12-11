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
      attributes: ["id", "user1Id", "user2Id", "user1_notifications", "user2_notifications"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
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

    for (let i = 0; i < conversations.length; i++) {
      const isUser1 = userId === conversations.user1Id;
      const isUser2 = userId === conversations.user2Id;
      const convo = conversations[i];
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

      // set properties for notification count and latest message preview
      if (isUser1) {
        convoJSON.notifications = conversations[i].user1_notifications;
      } else {
        convoJSON.notifications = conversations[i].user2_notifications;
      }
      const propsClientDoesntNeed = ['user1Id', 'user2Id', 'user1_notifications', 'user2_notifications'];
      propsClientDoesntNeed.forEach((prop) => delete convoJSON[prop])
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  const userId = req.user.id;
  const { conversationId } = req.body;

  try {
    const conversation = await Conversation.findOne({
      where: { id: conversationId }
    });
    const isUser1 = userId === conversation.dataValues.user1Id;
    const isUser2 = userId === conversation.dataValues.user2Id;

    if (isUser1) {
      conversation.update({ user1_notifications: 0 },{where: {id: conversationId}});
    } else if (isUser2) {
      conversation.update({ user2_notifications: 0 });
    } else {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(201)
  } catch (error) {
    next(error);
  }
});

module.exports = router;