import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setMessagesAsRead,
  setNotifications,
  setMostRecentReadMessage
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
    const notifications = -1;
    store.dispatch(setNotifications(data.message.conversationId, notifications))
  });

  socket.on("read-messages", (data) => {
    const { conversationId, newlyReadMessageIds } = data;
    const lastIndex = newlyReadMessageIds.length - 1;
    const mostRecentMessageId = newlyReadMessageIds[lastIndex];
    store.dispatch(setMostRecentReadMessage(conversationId, mostRecentMessageId))
    store.dispatch(setMessagesAsRead(conversationId, newlyReadMessageIds));
  });
});

export default socket;
