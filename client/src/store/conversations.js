import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  setUnreadMessagesCountInStore,
  setMessagesAsReadInStore,
  setMostRecentReadMessageInStore,
  saveLatestMessageText,
  saveOtherUserTyping,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const SET_UNREAD_MESSAGE_COUNT = "SET_UNREAD_MESSAGE_COUNT";
const SET_MESSAGES_AS_READ = "SET_MESSAGES_AS_READ";
const SET_CONVO_RECENT_MSG = "SET_CONVO_RECENT_MSG";
const SET_LATEST_TEXT = "SET_LATEST_TEXT";
const SET_OTHER_USER_TYPING = "SET_OTHER_USER_TYPING";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

export const setUnreadMessageCount = (conversationId, unreadMessageCount) => {
  return {
    type: SET_UNREAD_MESSAGE_COUNT,
    payload: { conversationId, unreadMessageCount },
  };
};

//set message.read as true when recipient reads that message
export const setMessagesAsRead = (conversationId, newlyReadMessageIds) => {
  return {
    type: SET_MESSAGES_AS_READ,
    payload: { conversationId, newlyReadMessageIds },
  };
};

export const setMostRecentReadMessage = (conversationId, messageId) => {
  return {
    type: SET_CONVO_RECENT_MSG,
    payload: { conversationId, messageId },
  };
};

export const setLatestMessageText = (senderId, setAsTyping) => {
  return {
    type: SET_LATEST_TEXT,
    payload: {
      senderId,
      setAsTyping,
    },
  };
};

export const setOtherUserTyping = (recipientId, status, conversationId, senderId) => {
  return {
    type: SET_OTHER_USER_TYPING,
    payload: { recipientId, status, conversationId, senderId },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversations;
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage,
      );
    case SET_UNREAD_MESSAGE_COUNT:
      return setUnreadMessagesCountInStore(
        state,
        action.payload.conversationId,
        action.payload.unreadMessageCount,
      );
    case SET_MESSAGES_AS_READ:
      return setMessagesAsReadInStore(
        state,
        action.payload.conversationId,
        action.payload.newlyReadMessageIds,
      );
    case SET_CONVO_RECENT_MSG:
      return setMostRecentReadMessageInStore(
        state,
        action.payload.conversationId,
        action.payload.messageId,
      );
    case SET_LATEST_TEXT:
      return saveLatestMessageText(state, action.payload);
    case SET_OTHER_USER_TYPING:
      const newState = saveOtherUserTyping(state, action.payload);
      return newState;
    default:
      return state;
  }
};

export default reducer;
