import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setLatestMessageText,
  setOtherUserTyping,
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
  socket.on("new-message", ({ message, sender }) => {
    const setAsTyping = false;
    store.dispatch(setLatestMessageText(message.senderId, setAsTyping));
    store.dispatch(setNewMessage(message, sender));
  });
  socket.on("typing", ({ status, recipientId, conversationId, senderId }) => {
    const setAsTyping = status;
    store.dispatch(setLatestMessageText(senderId, setAsTyping));
    store.dispatch(setOtherUserTyping(recipientId, status, conversationId, senderId));
  });
});

export default socket;
