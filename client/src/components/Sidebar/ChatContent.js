import React from "react";
import { Badge, Box, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

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
    fontSize: 12,
    color: "grey",
    letterSpacing: -0.17,
  },
  previewTextUnread: {
    fontWeight: "bold",
    color: "black",
  },
  container: {
    marginRight: "30px",
  },
  badge: {
    fontWeight: "bold",
    fontSize: 10,
    transform: "translate(400%, 50%)",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { latestMessageText, otherUser, unreadMessageCount } = conversation;
  const unreadMessagesExist = !!unreadMessageCount;
  const latestMessageClass = unreadMessagesExist ? `${classes.previewText} ${classes.previewTextUnread}` : classes.previewText;

  return (
    <Box className={classes.root}>
      <Grid container>
        <Box className={classes.container}>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography className={latestMessageClass}>
            {latestMessageText}
          </Typography>
        </Box>
        {unreadMessageCount > 0 && (
          <Badge
            classes={{ badge: `${classes.badge}` }}
            color="primary"
            max={99}
            badgeContent={unreadMessageCount}
          />
        )}
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(ChatContent);
