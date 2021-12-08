import React from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: 20,
    position: "relative",
  },
    username: {
      fontWeight: "bold",
      letterSpacing: -0.2,
    },
    previewText: {
      fontWeight: "bold",
      fontSize: 12,
      color: "black",
      letterSpacing: -0.17,
    },
    container: {
      marginRight: "30px",
    },
    unreadMessages: {
      fontSize: 13,
      color: "white",
      letterSpacing: -0.17,
      marginLeft: "10px",
      textAlign: "center",
      transform: "translateY(50%)",
      borderRadius: "120px",
      background: "#3F92FF",
      width: "25px",
      height: "55%",
      lineHeight: "25px",
    }
}));

const ChatContent = (props) => {
  const classes = useStyles();
  const { conversation, user } = props;
  const { latestMessageText, otherUser } = conversation;
  const unreadMessages = conversation.messages.reduce((prev, cur) => {
    const isUnread = cur.read === false
    const isSender = user.id !== cur.senderId;
    if (isUnread && isSender) {
      return prev + 1;
    }
    return prev;
  }, 0);

  return (
    <Box className={classes.root}>
      <Grid container>
        <Box className={classes.container}>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography className={classes.previewText}>
            {latestMessageText}
          </Typography>
        </Box>
          {unreadMessages !== 0 ?
            <Typography className={classes.unreadMessages}>
              {unreadMessages}
            </Typography> : null}
      </Grid>
    </Box>
  );
};

export default ChatContent;
