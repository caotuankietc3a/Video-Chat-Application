import React, { useEffect, useState, useRef } from "react";
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

const ChatForm = ({ conversation, user, socket_chat, socket_video }) => {
  console.log("ChatForm running");
  const dispatch = useDispatch();
  const { reply } = useSelector((state) => state.reply);
  const navigate = useNavigate();
  const [attachMents, setAttachMents] = useState([]);
  const [images, setImages] = useState([]);
  const imagesRef = useRef(null);
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
      }, 500);
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

  const onClickHandler = async (e, message) => {
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

  const clickVideoCall = async (e) => {
    e.preventDefault();
    if (conversation.no_mems) {
      socket_video.emit("make-group-connection-call", {
        conversationId: conversation._id,
        callerId: user._id,
      });
      return navigate(`/meeting-group/${conversation._id}`);
    }
    dispatch(videoStreamStart(navigate, conversation, true));
  };

  const multipleImagesHandler = () => {
    const array = [];
    for (let i = 0; i < imagesRef.current?.files.length; i++) {
      array.push({
        data: URL.createObjectURL(imagesRef.current.files[i]),
      });
    }
    setImages((preImgs) => [...preImgs, ...array]);
  };

  const removeImageInBuffers = (img) => {
    setImages((preImages) => {
      const index = preImages.findIndex((preImg) => preImg.data === img.data);
      index !== -1 && preImages.splice(index, 1);
      return [...preImages];
    });
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
        imagesRef={imagesRef}
        multipleImagesHandler={multipleImagesHandler}
        images={images}
        removeImageInBuffers={removeImageInBuffers}
      />
    </ChatFormContainer>
  );
};

export default ChatForm;
