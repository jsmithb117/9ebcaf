import React, { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { setNotifications } from "../../store/conversations";
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

const ActiveChat = (props) => {
  const { setNotifications } = props;
  const classes = useStyles();
  const { user, handleReadMessages } = props;
  const userId = user.id;
  const conversation = useMemo(() => props.conversation || {}, [props.conversation]);
  const notifications = conversation.notifications || 0;
  const [latestMessageReadId, setLatestMessageReadId] = useState(conversation.latestMessageReadId || 0);
  const messages = conversation.messages || [];
  const latestMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    const conversationId = conversation.id;
    if (notifications > 0 && userId) {
      const notifications = 0;
      setNotifications(conversationId, notifications);
    }
  }, [setNotifications, notifications, conversation, userId]);

  useEffect(() => {
    if (latestMessageReadId <= latestMessageId) {
    const conversationId = conversation.id;
    const messages = conversation.messages;
      const newlyReadMessageIds = [];
      messages.forEach((message) => {
        if (!message.read && message.senderId !== userId) {
          newlyReadMessageIds.push(message.id);
        }
      });
      if (newlyReadMessageIds.length > 0) {
        setLatestMessageReadId(latestMessageId);
        handleReadMessages({ conversationId, newlyReadMessageIds });
      }
    }
  }, [latestMessageReadId, latestMessageId, conversation, userId]);


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
              latestMessageReadId={latestMessageReadId}
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
    setNotifications: (conversationId, notifications) => {
      dispatch(setNotifications(conversationId, notifications));
    },
    handleReadMessages: (conversationId, newlyReadMessageIds) => {
      dispatch(handleReadMessages(conversationId, newlyReadMessageIds));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
