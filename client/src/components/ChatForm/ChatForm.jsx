import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Input from "./Input/Input";
import BodyBar from "./BodyBar/BodyBar";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../store/actions/fetch-action";
import { videoActions } from "../../store/slices/video-chat-slice";
import { useNavigate } from "react-router-dom";
import { ChatFormContainer } from "./StyledChatForm";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
import { replyActions } from "../../store/slices/reply-slice";
import { messageActions } from "../../store/slices/message-slice";

const ChatForm = ({ conversation, user, socket_chat, socket_video }) => {
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
      }, 1250);
      setMessages((preMessages) => [...preMessages, ...data]);
    })();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    socket_chat.emit("join-chat", { conversationId: conversation._id });

    socket_chat.on("receive-message", ({ text, userId, reply }) => {
      setMessages((preMessages) => [
        ...preMessages,
        {
          text: text,
          senderId: userId,
          reply,
          date: new Date(Date.now()),
        },
      ]);
      dispatch(messageActions.setReRender({ reRender: { text } }));
    });

    socket_chat.on("forward-message", ({ messageOb }) => {
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
      console.log("hehehehehe");
      setMessages((preMessages) => {
        const index = preMessages.findIndex((mes) => mes.text === text);
        console.log(index);
        index !== -1 && preMessages.splice(index, 1);
        // preMessages.splice(index, 1);
        console.log(preMessages);
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
