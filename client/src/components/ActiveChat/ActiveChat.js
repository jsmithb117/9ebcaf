import React, { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { setUnreadMessageCount, setMostRecentReadMessage } from "../../store/conversations";
import { handleReadMessages } from '../../store/utils/thunkCreators';

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const findLatestMessageId = (newlyReadMessageIds, messages, userId) => {
  const latestMessageId = messages.reduce((latestMessageId, message) => {
    if (message.senderId !== userId && message.id >= latestMessageId) {
      latestMessageId = message.id;
    }
    return latestMessageId;
  }, 0);
  return latestMessageId;
};

const ActiveChat = (props) => {
  const { setUnreadMessageCount, user, handleReadMessages } = props;
  const classes = useStyles();
  const userId = user.id;
  const conversation = useMemo(() => props.conversation || { messages: [] }, [props.conversation]);
  const [unreadMessageCount, setUnreadMessageCountState] = useState(conversation.unreadMessageCount || 0);
  const messages = conversation.messages;
  const conversationId = conversation.id;
  const [latestMessageReceivedId, setLatestMessageReceivedId] = useState(conversation.latestMessageReadId || 0);

  useEffect(() => {
    if (conversation.unreadMessageCount > 0 && conversation.id) {
      setUnreadMessageCount(conversation.id, 0);
      setUnreadMessageCountState(0);
  }
  }, [conversation, setUnreadMessageCount]);


  useEffect(() => {
    const renderingUnreadMessages = messages.reduce((hasUnreadMessages, message) => {
      if (!message.read && message.senderId !== userId) {
        hasUnreadMessages = true;
      }
      return hasUnreadMessages;
    }, false);
    if (renderingUnreadMessages) {
      const newlyReadMessageIds = messages.reduce((newlyReadMessageIds, message) => {
        if (message.senderId !== userId && !message.read) {
          newlyReadMessageIds.push(message.id);
        }
        return newlyReadMessageIds;
      }, []);

      const latestMessageReadId = findLatestMessageId(newlyReadMessageIds, messages, userId);
      handleReadMessages({ conversationId, newlyReadMessageIds });
      setLatestMessageReceivedId(latestMessageReadId);
      setMostRecentReadMessage(latestMessageReadId);
    }
  }, [messages, userId, handleReadMessages, conversationId, unreadMessageCount, conversation])

  useEffect(() => {
    setLatestMessageReceivedId(conversation.latestMessageReadId);
  }, [setLatestMessageReceivedId, conversation.latestMessageReadId]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user?.id}
              latestMessageReadId={latestMessageReceivedId}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) =>
          conversation.otherUser.username === state.activeConversation
      ),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUnreadMessageCount: (conversationId, unreadMessageCount) => {
      dispatch(setUnreadMessageCount(conversationId, unreadMessageCount));
    },
    handleReadMessages: (conversationId, newlyReadMessageIds) => {
      dispatch(handleReadMessages(conversationId, newlyReadMessageIds));
    },
    setMostRecentReadMessage: (messageId) => {
      dispatch(setMostRecentReadMessage(messageId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
