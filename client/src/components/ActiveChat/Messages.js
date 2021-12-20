import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, latestMessageReadId } = props;
  const [latestMessageId, setLatestMessageId] = useState(latestMessageReadId);

  useEffect(() => {
    setLatestMessageId(latestMessageReadId);
  }, [latestMessageReadId]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        const isLatestReadMessage = latestMessageId === message.id;
        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUser={otherUser} isLatestReadMessage={isLatestReadMessage} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
