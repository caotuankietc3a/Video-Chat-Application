import React, { useEffect, useRef } from "react";
import {} from "react-router-dom";
import Message from "./Message";
import { MessagesBodyContainer, MessagesBodyContent } from "./StyledBodyMsg";
import { useSelector } from "react-redux";
import { formatDate } from "../../../store/actions/common-function";

const BodyBar = ({ messages, isGroup = false }) => {
  const userState = useSelector((state) => state.user);
  const bodyMessagesDisplay = (messages, formatDate) => {
    return messages.map((mes, i) => {
      let typeDisplay = "left";
      const mesDivider = {
        divider: false,
        data_label: "",
      };
      if (userState.user._id === mes.sender._id) typeDisplay = "right";
      if (
        i === 0 ||
        formatDate(messages[i - 1].date).split(",")[0] !==
          formatDate(mes.date).split(",")[0]
      ) {
        mesDivider.divider = true;
        mesDivider.data_label = formatDate(mes.date).split(",")[0];
      }
      return (
        <Message
          key={i}
          text={mes.text}
          date={formatDate(new Date(mes.date))}
          type={typeDisplay}
          mesDivider={mesDivider}
          reply={mes.reply}
          forward={mes.forward}
          sender={mes.sender}
          isGroup={isGroup}
        />
      );
    });
  };
  return (
    <MessagesBodyContainer>
      <MessagesBodyContent>
        {bodyMessagesDisplay(messages, formatDate)}
      </MessagesBodyContent>
    </MessagesBodyContainer>
  );
};
export default BodyBar;
