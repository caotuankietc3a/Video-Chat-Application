import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { MessagesBodyContainer, MessagesBodyContent } from "./StyledBodyMsg";
import { useSelector } from "react-redux";

const BodyBar = (props) => {
  const userState = useSelector((state) => state.user);
  const { messages } = props;

  // const scrollRef = useRef();

  // useEffect(() => {
  //    scrollRef.current?.scrollIntoView({
  //       behavior: "smooth", block: "nearest",
  //       inline: "start"
  //    });
  // }, [props.messages]);
  // console.log(window.screen.height);
  return (
    <MessagesBodyContainer>
      <MessagesBodyContent>
        {messages.map((mes, i) => {
          console.log(mes);
          let typeDisplay = "right";
          if (userState.user._id === mes.senderId) typeDisplay = "left";
          return (
            <Message
              key={i}
              text={mes.text}
              date={new Date(mes.date)}
              type={typeDisplay}
            />
          );
        })}
      </MessagesBodyContent>
    </MessagesBodyContainer>
  );
};
export default BodyBar;
