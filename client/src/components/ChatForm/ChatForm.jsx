import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { errorActions } from "../../store/slices/error-slice";

const ChatForm = ({ conversation, user, socket_chat, socket_video }) => {
  console.log("ChatForm running");
  const dispatch = useDispatch();
  const { reply } = useSelector((state) => state.reply);
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);
  const [images, setImages] = useState([]);
  const imagesRef = useRef(null);
  const attachmentsRef = useRef(null);
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

    socket_chat.on("receive-message", ({ id, text, sender, reply, files }) => {
      setMessages((preMessages) => [
        ...preMessages,
        {
          text: text,
          sender,
          reply,
          date: new Date(Date.now()),
          files,
          _id: id,
        },
      ]);
      dispatch(messageActions.setReRender({ reRender: { text } }));
    });

    socket_chat.on("forward-message", ({ messageOb }) => {
      setMessages((preMessages) => {
        return [...preMessages, { ...messageOb }];
      });
    });

    socket_chat.on("delete-message", ({ id }) => {
      setMessages((preMessages) => {
        const index = preMessages.findIndex((mes) => mes._id === id);
        index !== -1 && preMessages.splice(index, 1);
        return [...preMessages];
      });
      dispatch(messageActions.setReRender({ reRender: { id } }));
    });

    return function cleanup() {
      socket_chat.emit("leave-chat", { conversationId: conversation._id });
    };
  }, []);

  useEffect(() => {}, []);

  const onClickHandler = async (e, message) => {
    e.preventDefault();
    console.log(reply);
    try {
      if (
        message ||
        images.length !== 0 ||
        attachments.length !== 0 ||
        reply.images.length !== 0 ||
        reply.attachments.length !== 0
      ) {
        const oldMes = message;
        let replyOb = reply ? reply : null;
        const id = uuidv4();
        socket_chat.emit("send-message", {
          id,
          userId: user._id,
          message: message,
          reply: replyOb,
          conversationId: conversation._id,
          files: {
            images: images,
            attachments: attachments,
          },
        });
        setImages([]);
        setAttachments([]);
        dispatch(replyActions.setReply({ reply: null }));
        await postData(
          {
            newMessage: oldMes,
            replyOb,
            dataImgs: images,
            dataAttachments: attachments,
            id,
          },
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
    for (let i = 0; i < imagesRef.current?.files.length; i++) {
      const reader = new FileReader();
      const file = imagesRef?.current.files[i];
      reader.onload = () => {
        setImages((preImgs) => [
          ...preImgs,
          { url: reader.result, name: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImageInBuffers = (url, name) => {
    setImages((preImages) => {
      const index = preImages.findIndex(
        (preImg) => preImg.url === url && preImg.name === name
      );
      index !== -1 && preImages.splice(index, 1);
      return [...preImages];
    });
  };

  const multipleAttachmentsHandler = () => {
    console.log(attachmentsRef.current?.files);
    for (let i = 0; i < attachmentsRef.current?.files.length; i++) {
      const file = attachmentsRef.current?.files[i];
      if (file.type === "text/x-c++src") {
        return dispatch(
          errorActions.setError({ error: "Cannot upload files c++!" })
        );
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAttachments((preAttachment) => [
          ...preAttachment,
          {
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            url: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachmentInBuffers = (size, name) => {
    setAttachments((preAttachments) => {
      const i = preAttachments.findIndex(
        (preAttachment) =>
          preAttachment.size === size && preAttachment.name === name
      );
      i !== -1 && preAttachments.splice(i, 1);
      return [...preAttachments];
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
        attachmentsRef={attachmentsRef}
        multipleImagesHandler={multipleImagesHandler}
        multipleAttachmentsHandler={multipleAttachmentsHandler}
        images={images}
        removeImageInBuffers={removeImageInBuffers}
        removeAttachmentInBuffers={removeAttachmentInBuffers}
        attachments={attachments}
      />
    </ChatFormContainer>
  );
};

export default ChatForm;
