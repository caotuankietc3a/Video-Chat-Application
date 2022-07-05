import React from "react";
import {} from "react-router-dom";
import Message from "./Message";
import { MessagesBodyContainer, MessagesBodyContent } from "./StyledBodyMsg";
import { useSelector } from "react-redux";
import { formatDate } from "../../../store/actions/common-function";

const BodyBar = ({ messages, isGroup = false, searchMessage }) => {
  const userState = useSelector((state) => state.user);
  const bodyMessagesDisplay = (messages, formatDate) => {
    return messages
      .filter((mes) => {
        const images = mes.files.images;
        const attachments = mes.files.attachments;
        if (searchMessage === "") return true;

        if (
          mes.text.toLowerCase().indexOf(searchMessage.toLowerCase()) !== -1
        ) {
          return true;
        } else if (images.length !== 0) {
          const index = images.findIndex(
            (img) =>
              img.name.toLowerCase().indexOf(searchMessage.toLowerCase()) !== -1
          );
          return index !== -1 ? true : false;
        } else if (attachments.length !== 0) {
          const index = attachments.findIndex(
            (attachment) =>
              attachment.name
                .toLowerCase()
                .indexOf(searchMessage.toLowerCase()) !== -1
          );
          return index !== -1 ? true : false;
        }
        return false;
      })
      .map((mes, i) => {
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
            id={mes._id}
            text={mes.text}
            date={formatDate(new Date(mes.date))}
            type={typeDisplay}
            mesDivider={mesDivider}
            reply={mes.reply}
            forward={mes.forward}
            sender={mes.sender}
            isGroup={isGroup}
            images={mes.files.images}
            attachments={mes.files.attachments}
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
