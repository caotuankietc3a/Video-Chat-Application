import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Input from "./Input/Input";
import BodyBar from "./BodyBar/BodyBar";
import { useDispatch } from "react-redux";
import { postData } from "../../store/actions/fetch-action";
import { videoActions } from "../../store/slices/video-chat-slice";
import { useNavigate } from "react-router-dom";
import { ChatFormContainer } from "./StyledChatForm";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";

const ChatForm = ({ conversation, user, socket_chat, socket_video }) => {
  console.log("ChatForm running hhhhhhhhhhhhhhh");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [messages, setMessages] = useState([]);
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;

  useEffect(() => {
    let timer = 0;
    (async () => {
      const res = await fetch(
        `${END_POINT_SERVER}/conversation/messages/${conversation._id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      timer = setTimeout(() => {
        setIsFetching(false);
      }, 1250);
      setMessages((preMessages) => [...preMessages, ...data]);
    })();

    return () => {
      clearTimeout(timer);
    };
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
  useEffect(() => {
    socket_chat.on("delete-message", ({ text }) => {
      setMessages((preMessages) => {
        const new_messages = [...preMessages];
        const index = new_messages.findIndex((mes) => mes.text === text);
        new_messages.splice(index, 1);
        return new_messages;
      });
    });
    return function cleanup() {
      socket_chat.off("delete-message");
    };
  }, [messages]);

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
        `${END_POINT_SERVER}/conversation/new-message/?conversationId=${conversation._id}&userId=${user._id}`
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
      {isFetching ? <TikTokSpinner /> : <BodyBar messages={messages} />}
      <Input
        clickHandler={onClickHandler}
        message={message}
        changeHandler={onChangeHandler}
      />
    </ChatFormContainer>
  );
};

export default ChatForm;
