import React from "react";
import { Box, Typography, Grid } from "@material-ui/core";
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
      fontWeight: "bold",
      fontSize: 12,
      color: "black",
      letterSpacing: -0.17,
    },
    container: {
      marginRight: "30px",
    },
    notifications: {
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
  const { conversation } = props;
  const { latestMessageText, otherUser, notifications } = conversation;
  const notificationsExist = !!notifications;
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
          {notificationsExist &&
            <Typography className={classes.notifications}>
              {notifications}
            </Typography>}
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