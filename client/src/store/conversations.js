import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  setNotificationsInStore,
  setMessageAsReadInStore,
  setMostRecentReadMessageInStore,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
const SET_MESSAGE_AS_READ = "SET_MESSAGE_AS_READ";
const SET_CONVO_RECENT_MSG ="SET_CONVO_RECENT_MSG";

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

export const setNotifications = (conversationId, notifications) => {
  return {
    type: SET_NOTIFICATIONS,
    payload: { conversationId, notifications },
  };
};

//set message.read as true when recipient reads that message
export const setMessageAsRead = ( conversationId, messageId ) => {
  return {
    type: SET_MESSAGE_AS_READ,
    payload: { conversationId, messageId },
  };
};

export const setMostRecentReadMessage = (conversationId, messageId) => {
  return {
    type: SET_CONVO_RECENT_MSG,
    payload: { conversationId, messageId },
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
    case SET_NOTIFICATIONS:
      return setNotificationsInStore(
        state,
        action.payload.conversationId,
        action.payload.notifications,
      );
      case SET_MESSAGE_AS_READ:
        return setMessageAsReadInStore(
          state,
          action.payload.conversationId,
          action.payload.messageId,
        );
      case SET_CONVO_RECENT_MSG:
        return setMostRecentReadMessageInStore(
          state,
          action.payload.conversationId,
          action.payload.messageId,
        )
    default:
      return state;
  }
};

export default reducer;
