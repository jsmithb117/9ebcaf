import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setMessageAsRead,
  setNotifications,
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

  socket.on("read-message", (data) => {
    store.dispatch(setMessageAsRead(data.messageId, data.conversationId));
  });
});

export default socket;
