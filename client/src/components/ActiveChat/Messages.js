import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, conversationId, latestMessageReadId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        const isLatestReadMessage = latestMessageReadId === message.id;
        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} messageIsRead={message.read} otherUser={otherUser} isLatestReadMessage={isLatestReadMessage} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} messageId={message.id} messageIsRead={message.read} conversationId={conversationId} />
        );
      })}
    </Box>
  );
};

export default Messages;
