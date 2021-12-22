export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      const messages = convoCopy.messages;
      if (messages[messages.length - 1].id === 0) {
        messages.pop();
      }
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      convoCopy.otherUser.typing = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const saveLatestMessageText = (state, payload) => {
  return state.map((convo) => {
    if (convo.otherUser.id === payload.senderId) {
      const convoCopy = { ...convo };

      if (payload.setAsTyping) {
        convoCopy.latestMessageText = "Typing...";
      } else if (convo.messages[convo.messages.length - 1]) {
        convoCopy.latestMessageText = convo.messages[convo.messages.length - 1].text;
      } else {
        convoCopy.latestMessageText = "";
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const saveOtherUserTyping = (state, payload) => {
  return state.map((convo) => {
    if (convo.id === payload.conversationId) {
      const convoCopy = { ...convo };
      const messages = convoCopy.messages;
      const lastMessagesIndex = messages.length - 1;
      convoCopy.otherUser.typing = false;

      if (payload.status) {
        convoCopy.otherUser.typing = true;
      }
      if (messages[lastMessagesIndex].id === 0) {
        convoCopy.messages[lastMessagesIndex].pop();
      }
      return convoCopy;
    }
    return convo;
  });
};
