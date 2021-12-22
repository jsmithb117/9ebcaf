export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessageCount: 0,
    };
    if (message.senderId === sender.id) {
      newConvo.unreadMessageCount = 0;
    }
    newConvo.latestMessageText = message.text;

    return [newConvo, ...state.filter((convo) => convo.otherUser.id !== sender.id)];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      const messages = convoCopy.messages;
      if (messages[messages.length - 1].id === 0) {
        messages.pop();
      }
<<<<<<< HEAD
      convoCopy.messages = [...messages, message];
=======
      convoCopy.messages.push(message);
>>>>>>> 46c952b4025fe58d227ac5a6644fed6a35744bcb
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
      convoCopy.messages = [message, ...convo.messages];
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const setUnreadMessagesCountInStore = (state, conversationId, unreadMessageCount) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      if (unreadMessageCount >= 0) {
        convoCopy.unreadMessageCount = unreadMessageCount;
      } else {
        convoCopy.unreadMessageCount += 1;
      }
      return convoCopy;
    }
    return convo;
  });
};

export const setMessagesAsReadInStore = (state, conversationId, newlyReadMessageIds) => {
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      const messageIdsLookup = {};
      // make table of message ids so we can lookup faster
      newlyReadMessageIds.forEach((message) => {
        messageIdsLookup[message] = true;
      });

      const convoCopy = { ...conversation };
      const lastIndex = newlyReadMessageIds.length - 1;
      convoCopy.latestMessageReadId = newlyReadMessageIds[lastIndex];
      convoCopy.messages = convoCopy.messages.map((message) => {
        if (messageIdsLookup[message.id]) {
          const messageCopy = { ...message };
          messageCopy.read = true;
          return messageCopy;
        }
        return message;
      });
      return convoCopy;
    }
    return conversation;
  });
};

export const setMostRecentReadMessageInStore = (state, conversationId, messageId) => {
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      const convoCopy = { ...conversation };
      if (messageId > convoCopy.latestMessageReadId) {
        convoCopy.latestMessageReadId = messageId;
      }
      return convoCopy;
    }
    return conversation;
  });
};
