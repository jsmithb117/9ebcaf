import produce from 'immer';

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
    return produce(state, (draft) => {
      draft.unshift(newConvo);
      return draft;
    })
  }

  return produce(state, (draft) => {
    draft.forEach((convo, index) => {
      if (convo.id === message.conversationId) {
        draft[index].messages.unshift(message);
        draft[index].latestMessageText = message.text;
      }
      return convo;
    })
  })
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
  return produce(state, (draft) => {
    draft.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });
    users.forEach((user) => {
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        draft.push(fakeConvo);
      }
    })
    return draft;
  })
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return produce(state, (draft) => {
    draft.forEach((convo) => {
      if (convo.otherUser.id === recipientId) {
        convo.id = message.conversationId;
        convo.messages.unshift(message);
        convo.latestMessageText = message.text;
      }
        return convo
    })
});
}
