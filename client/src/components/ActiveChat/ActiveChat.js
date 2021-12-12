import React, { useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { setNotifications } from "../../store/conversations";

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
  const { user } = props;
  const conversation = useMemo(() => props.conversation || {}, [props.conversation]);
  const notifications = conversation.notifications || 0;
  const latestMessageReadId = conversation.latestMessageReadId;
  useEffect(() => {
    if (notifications > 0 && user.id) {
      const conversationId = conversation.id;
      const notifications = 0;
      setNotifications(conversationId, notifications);
    }
  }, [setNotifications, notifications, conversation, user])

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
              conversationId={conversation.id}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
