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
    fontWeight: "bold",
    fontSize: 12,
    color: "black",
    letterSpacing: -0.17,
  },
  container: {
    marginRight: "30px",
  },
  badge: {
    transform: "translate(400%, 50%)",
  },
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
        {notifications > 0 && (
          <Badge
            classes={{ badge: `${classes.badge}` }}
            color="primary"
            max={99}
            badgeContent={notifications}
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