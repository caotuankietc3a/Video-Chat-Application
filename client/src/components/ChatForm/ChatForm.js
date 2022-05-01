import React, { useEffect, useState, useRef } from "react";
import Header from "./Header/Header";
import Input from "./Input/Input";
import BodyBar from "./BodyBar/BodyBar";
import { useSelector, useDispatch } from "react-redux";
import { postData } from "../../store/fetch-action";
import { videoActions } from "../../store/video-chat-slice";
import { useNavigate } from "react-router-dom";
import {
  videoStreamStart,
  answerCall,
  callUser,
} from "../../store/video-chat-function";
import { ChatFormContainer } from "./StyledChatForm";

const ChatForm = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { conversation, user, socket_chat, socket_video } = props;
  useEffect(() => {
    (async () => {
      const res = await fetch(
        `http://localhost:5000/conversation/messages/${conversation._id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setMessages((preMessages) => [...preMessages, ...data]);
    })();
  }, []);

  useEffect(() => {
    socket_chat.emit("join-chat", { conversationId: conversation._id });

    socket_chat.on("receive-message", ({ text, userId }) => {
      setMessages((preMessages) => [
        ...preMessages,
        {
          text: text,
          senderId: userId,
          date: new Date(Date.now()),
        },
      ]);
    });
    return function cleanup() {
      socket_chat.emit("leave-chat", { conversationId: conversation._id });
      // socket.off();
    };
  }, []);

  const onClickHandler = async (e) => {
    e.preventDefault();
    if (message) {
      const oldMes = message;
      socket_chat.emit("send-message", {
        userId: user._id,
        message: message,
        conversationId: conversation._id,
      });
      setMessage("");
      await postData(
        { newMessage: oldMes },
        `http://localhost:5000/conversation/new-message/?conversationId=${conversation._id}&userId=${user._id}`
      );
    }
  };

  const onChangeHandler = (e) => {
    setMessage(e.target.value);
  };

  const clickVideoCall = async (e) => {
    e.preventDefault();
    socket_video.emit(
      "make-connection-call",
      { conversationId: conversation._id, caller: user },
      (callee) => {
        dispatch(
          videoActions.setCall({
            call: {
              isReceivedCall: false,
              caller: user,
              callee: callee,
            },
          })
        );
      }
    );
    setTimeout(() => {
      navigate(`/home-chat/meetings/${conversation._id}`);
    }, 500);
  };
  return (
    <ChatFormContainer>
      <Header conversation={conversation} onClickVideoCall={clickVideoCall} />
      <BodyBar messages={messages} />
      <Input
        clickHandler={onClickHandler}
        message={message}
        changeHandler={onChangeHandler}
      />
    </ChatFormContainer>
  );
};

export default ChatForm;
