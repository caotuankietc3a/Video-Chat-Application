import React, {useEffect, useRef} from "react";
import Message from './Message';
import {MessagesBodyContainer, MessagesBodyContent} from './StyledBodyMsg';
import {useSelector} from 'react-redux';

const BodyBar = (props) => {
   const userState = useSelector((state) => state.user);
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
            {
               props.messages.map((mes, i) => {
                  if (userState.user._id === mes.senderId) return <Message key={i} text={mes.text} date={new Date(mes.date)} type="right" />
                  return <Message key={i} text={mes.text} date={new Date(mes.date)} type="left" />
               })
            }
         </MessagesBodyContent>
      </MessagesBodyContainer>
   );
}
export default BodyBar;
