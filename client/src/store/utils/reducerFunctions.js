export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      notifications: 0,
    };
    if (message.senderId === sender.id) {
      newConvo.notifications = 0;
    }
    newConvo.latestMessageText = message.text;

    return [newConvo, ...state.filter((convo) => convo.otherUser.id !== sender.id)];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = {
        ...convo,
      };
      convoCopy.messages.push(message)
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
      convoCopy.messages = [message, ...convo.messages];
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const setNotificationsInStore = (state, conversationId, notifications) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      if (notifications >= 0) {
        convoCopy.notifications = notifications;
      } else {
        convoCopy.notifications += 1;
      }
      return convoCopy;
    }
    return convo;
  });
};

export const setMessageAsReadInStore = (state, messageId, conversationId) => {
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      return conversation.messages.map((message) => {
        if (message.id === messageId) {
          const messageCopy = { ...message };
          messageCopy.read = true;
          return messageCopy;
        }
        return message;
      })
    }
    return conversation;
  });
};
