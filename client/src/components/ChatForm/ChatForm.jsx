import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Input from "./Input/Input";
import BodyBar from "./BodyBar/BodyBar";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../store/actions/fetch-action";
import { useNavigate } from "react-router-dom";
import { ChatFormContainer } from "./StyledChatForm";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
import { replyActions } from "../../store/slices/reply-slice";
import { messageActions } from "../../store/slices/message-slice";
import { videoStreamStart } from "../../store/actions/video-chat-function";

const ChatForm = ({ conversation, user, socket_chat }) => {
  console.log("ChatForm running");
  const dispatch = useDispatch();
  const { reply } = useSelector((state) => state.reply);
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
      }, 0);
      setMessages((preMessages) => [...preMessages, ...data]);
    })();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    socket_chat.emit("join-chat", { conversationId: conversation._id });

    socket_chat.on("receive-message", ({ text, sender, reply }) => {
      setMessages((preMessages) => [
        ...preMessages,
        {
          text: text,
          sender,
          reply,
          date: new Date(Date.now()),
        },
      ]);
      dispatch(messageActions.setReRender({ reRender: { text } }));
    });

    socket_chat.on("forward-message", ({ messageOb }) => {
      console.log(messageOb);
      setMessages((preMessages) => {
        return [...preMessages, { ...messageOb }];
      });
    });

    return function cleanup() {
      socket_chat.emit("leave-chat", { conversationId: conversation._id });
      // socket.off();
    };
  }, []);

  useEffect(() => {
    socket_chat.on("delete-message", ({ text }) => {
      setMessages((preMessages) => {
        const index = preMessages.findIndex((mes) => mes.text === text);
        // App will delete two times and does not know why
        index !== -1 && preMessages.splice(index, 1);
        return [...preMessages];
      });
      dispatch(messageActions.setReRender({ reRender: { text } }));
    });

    return function cleanup() {
      socket_chat.off("delete-message");
    };
  }, [messages]);

  const onClickHandler = async (e) => {
    e.preventDefault();
    try {
      if (message) {
        const oldMes = message;
        let replyOb = reply ? reply : null;
        socket_chat.emit("send-message", {
          userId: user._id,
          message: message,
          reply: replyOb,
          conversationId: conversation._id,
        });
        setMessage("");
        dispatch(replyActions.setReply({ reply: null }));
        await postData(
          { newMessage: oldMes, replyOb },
          `${END_POINT_SERVER}/conversation/new-message/?conversationId=${conversation._id}&userId=${user._id}`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onChangeHandler = (e) => {
    setMessage(e.target.value);
  };

  const clickVideoCall = async (e) => {
    e.preventDefault();
    dispatch(videoStreamStart(navigate, conversation, true));
  };

  return (
    <ChatFormContainer>
      <Header conversation={conversation} onClickVideoCall={clickVideoCall} />
      {isFetching ? (
        <TikTokSpinner />
      ) : (
        <BodyBar
          messages={messages}
          isGroup={conversation.no_mems ? true : false}
        />
      )}
      <Input
        clickHandler={onClickHandler}
        message={message}
        changeHandler={onChangeHandler}
      />
    </ChatFormContainer>
  );
};

export default ChatForm;
