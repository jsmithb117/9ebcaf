import React, { useState, useEffect } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import { sendTypingStatus } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { postMessage, otherUser, conversationId, user } = props;

  useEffect(() => {
    if (text.length > 0) {
      sendTypingStatus(true, otherUser.id, conversationId, user.id);
    } else {
      sendTypingStatus(false, otherUser.id, conversationId, user.id);
    }
  }, [text]);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
      read: false,
    };
    await postMessage(reqBody);
    setText("");
  };

  // only sends 'typing'(true) event if user has typed some text in the input field
  const handleTypingStatus = (status) => {
    if (status && text.length > 0) {
      sendTypingStatus(status, otherUser.id, conversationId, user.id);
    }
    if (!status) {
      sendTypingStatus(status, otherUser.id, conversationId, user.id);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          onFocus={() => handleTypingStatus(true)}
          onBlur={() => handleTypingStatus(false)}
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
  };
};

export default connect(null, mapDispatchToProps)(Input);
