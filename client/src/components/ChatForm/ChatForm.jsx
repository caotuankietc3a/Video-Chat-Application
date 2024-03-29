import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header/Header";
import Input from "./Input/Input";
import BodyBar from "./BodyBar/BodyBar";
import SearchBox from "./SearchBox/SearchBox";
import ChatInfo from "../ChatInfo/ChatInfo";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../store/actions/fetch-action";
import { useNavigate, useParams } from "react-router-dom";
import { ChatFormContainer, Block } from "./StyledChatForm";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
import { replyActions } from "../../store/slices/reply-slice";
import { messageActions } from "../../store/slices/message-slice";
import { videoStreamStart } from "../../store/actions/video-chat-function";
import { errorActions } from "../../store/slices/error-slice";
import Swal from "sweetalert2";
import { conversationActions } from "../../store/slices/conversation-slice";
import { formatDate } from "../../store/actions/common-function";

const ChatForm = ({
  conversation,
  user,
  socket_chat,
  socket_video,
  socket_notify,
  // conversationId,
}) => {
  console.log("ChatForm running");
  const dispatch = useDispatch();
  const params = useParams();
  const conversationId =
    params["*"].split("/")[params["*"].split("/").length - 1];
  const { reply } = useSelector((state) => state.reply);
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);
  const [images, setImages] = useState([]);
  const imagesRef = useRef(null);
  const attachmentsRef = useRef(null);
  const [isFetching, setIsFetching] = useState(true);
  const [closeChatInfo, setCloseChatInfo] = useState(false);
  const [block, setBlock] = useState(false);
  const [messages, setMessages] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;

  useEffect(() => {
    if (conversationId) {
      socket_chat.emit("join-chat", {
        conversationId: conversationId,
        userId: user._id,
      });

      setIsFetching(true);
      (async () => {
        const res = await fetch(
          `${END_POINT_SERVER}/conversation/messages/${conversationId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setIsFetching(false);
        setMessages([...data]);
      })();
      const { isBlocked } = blockHandler(conversation.members);
      toggleBlockHandler(isBlocked);
    }
  }, [conversationId]);

  useEffect(() => {
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
        if (index !== -1) {
          for (let i = 0; i < preMessages.length; i++) {
            if (
              preMessages[i].reply &&
              preMessages[i].reply.messageId === preMessages[index]._id
            ) {
              preMessages[i].reply = null;
            }
          }
          preMessages.splice(index, 1);
        }
        return [...preMessages];
      });
      dispatch(messageActions.setReRender({ reRender: { id } }));
    });

    socket_chat.on("delete-conversation", ({ msg, type, conversation }) => {
      Swal.fire({
        title: "Notification!!!",
        html: msg,
        icon: "warning",
        confirmButtonText: "Ok, I know",
      });
      if (type) {
        navigate("/home-chat");
        dispatch(conversationActions.setConversation({ conversation: {} }));
      } else {
        dispatch(
          conversationActions.setConversation({
            conversation: {
              _id: conversation._id,
              members: conversation.members,
              name: conversation.name,
              time: formatDate(new Date(Date.now())),
              status: true,
              profilePhoto: conversation.profilePhoto,
              no_mems: conversation.members.length,
            },
          })
        );
      }
    });

    socket_chat.on(
      "block-conversation",
      ({ isBlocked, userName, members, type }) => {
        if (type) {
          Swal.fire({
            title: isBlocked
              ? "The Conversation is blocked!!!"
              : "The Conversation is unblocked!!!",
            html: isBlocked
              ? `<strong><i>Note!!!!</i></strong> Your friend <strong>${userName}</strong> has blocked this conversation!!!`
              : `Your friend <strong>${userName}</strong> has unblocked this conversation!!!`,
            icon: "warning",
            showConfirmButton: true,
            confirmButtonColor: "#665dfe",
            allowOutsideClick: false,
          });
          toggleBlockHandler(isBlocked);
        }
        dispatch(conversationActions.setMembers({ members }));
      }
    );

    return function cleanup() {
      socket_chat.emit("leave-chat", {
        conversationId: conversationId,
        userId: user._id,
      });
    };
  }, []);

  const onClickHandler = async (e, message) => {
    console.log(user);
    e.preventDefault();
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
        setMessages((preMessages) => [
          ...preMessages,
          {
            text: message,
            sender: user,
            reply: replyOb,
            date: new Date(Date.now()),
            files: {
              images: images,
              attachments: attachments,
            },
            _id: id,
          },
        ]);
        socket_chat.emit("send-message", {
          id,
          user: user,
          message: message,
          reply: replyOb,
          conversationId: conversationId,
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
          `${END_POINT_SERVER}/conversation/new-message/?conversationId=${conversationId}&userId=${user._id}`
        );
        socket_notify.emit("send-message");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clickVideoCall = async (e) => {
    e.preventDefault();
    if (conversation.no_mems) {
      if (block) {
        return dispatch(
          errorActions.setError({
            error: "Can't call user because the conversation is blocked",
          })
        );
      }
      socket_video.emit("make-group-connection-call", {
        conversationId: conversationId,
        callerId: user._id,
      });
      navigate(`/meeting-group/${conversationId}`);
    } else {
      if (!conversation.status) {
        return dispatch(
          errorActions.setError({
            error: "Can't call user because user is offline",
          })
        );
      }
      if (block) {
        return dispatch(
          errorActions.setError({
            error: "Can't call user because the conversation is blocked",
          })
        );
      }
      dispatch(videoStreamStart(navigate, conversation, true));
    }
  };

  const multipleImagesHandler = () => {
    for (let i = 0; i < imagesRef.current?.files.length; i++) {
      const reader = new FileReader();
      const file = imagesRef?.current.files[i];
      reader.onload = () => {
        setImages((preImgs) => [
          ...preImgs,
          {
            url: reader.result,
            name: file.name,
            size: (file.size / 1024).toFixed(2),
          },
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

  const toggleShowSearchBox = () => {
    setShowSearchBox(!showSearchBox);
  };

  const searchMessageHandler = (e) => {
    setSearchMessage(e.target.value);
  };

  const toggleCloseChatInfo = () => {
    setCloseChatInfo(!closeChatInfo);
  };

  const deleteConversation = () => {
    const member = conversation.members.find(
      (member) => member.user._id === user._id
    );
    Swal.fire({
      title: "Delete this conversation?",
      text: "Once you delete the conversation, it can't be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#665dfe",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "The conversation has been deleted.", "success");

        socket_chat.emit("delete-conversation", {
          conversationId: conversationId,
          user: {
            userId: user._id,
            isAdmin: member.isAdmin,
            userName: user.fullname,
          },
          group: conversation.no_mems
            ? { isGroup: true, groupName: conversation.name }
            : { isGroup: false },
        });
        socket_notify.emit("delete-conversation");
        navigate("/home-chat");
        dispatch(conversationActions.setConversation({ conversation: {} }));
      }
    });
  };

  const blockConversation = () => {
    Swal.fire({
      title: !block ? "Block this conversation?" : "Unblock this conversation?",
      text: !block
        ? "Once you block the conversation, your friend can't chat anything!"
        : "Unblock this conversation means your friend can chat with you!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#665dfe",
      cancelButtonColor: "#d33",
      confirmButtonText: !block ? "Yes, block it!" : "Yes, unblock it!",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        !block
          ? Swal.fire(
              "Blocked!",
              "The conversation has been blocked.",
              "success"
            )
          : Swal.fire(
              "Unblocked!",
              "The conversation has been unblocked.",
              "success"
            );
        socket_chat.emit("block-conversation", {
          conversationId: conversationId,
          userId: user._id,
          isBlocked: !block,
          userName: user.fullname,
        });
        socket_notify.emit("block-conversation");
        // setBlock(!block);
        toggleBlockHandler(!block);
      }
    });
  };

  const blockHandler = (members) => {
    if (members) {
      const member = members.find((member) => {
        return member.user._id === user._id;
      });
      return {
        isBlocked: member.block.isBlocked,
        blockerId: member.block.userId,
        isAdmin: member.isAdmin,
      };
    }
    return {};
  };

  const checkUnblockHandler = () => {
    const { blockerId } = blockHandler(conversation.members);
    return blockerId === user._id;
  };

  const checkBlockHandler = () => {
    return checkUnblockHandler();
  };

  const displayBlockerName = () => {
    const { blockerId } = blockHandler(conversation.members);
    const member = conversation.members.find((member) => {
      return member.user._id === blockerId;
    });
    return member?.user?.fullname;
  };

  const blockGroupConversation = (groupBlock, blockeeId, cb) => {
    Swal.fire({
      title: !groupBlock ? "Block this member?" : "Unblock this member?",
      text: !groupBlock
        ? "Once you block, your friend can't chat anything!"
        : "Once you unblock, your friend can chat with others!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#665dfe",
      cancelButtonColor: "#d33",
      confirmButtonText: !groupBlock ? "Yes, block it!" : "Yes, unblock it!",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        !groupBlock
          ? Swal.fire("Blocked!", "Your friend has been blocked.", "success")
          : Swal.fire(
              "Unblocked!",
              "Your friend has been unblocked.",
              "success"
            );
        socket_chat.emit("block-member-conversation", {
          conversationId: conversationId,
          blockeeId,
          isBlocked: !groupBlock,
          userId: user._id,
          userName: user.fullname,
        });
        socket_notify.emit("block-member-conversation");
        cb();
      }
    });
  };
  //
  const checkGroupBlockHandler = () => {
    const member = conversation.members.find((member) => {
      return member.user._id === user._id;
    });
    return member.isAdmin;
  };

  const toggleBlockHandler = (isBlocked) => {
    setBlock(isBlocked);
  };

  return (
    <>
      <ChatFormContainer showSearchBox={showSearchBox}>
        <Header
          conversation={conversation}
          onClickVideoCall={clickVideoCall}
          toggleShowSearchBox={toggleShowSearchBox}
          toggleCloseChatInfo={toggleCloseChatInfo}
          deleteConversation={deleteConversation}
          blockConversation={blockConversation}
          block={block}
          isFetching={isFetching}
          checkUnblockHandler={checkUnblockHandler}
        />
        {showSearchBox && (
          <SearchBox searchMessageHandler={searchMessageHandler} />
        )}
        {isFetching ? (
          <TikTokSpinner />
        ) : (
          <BodyBar
            messages={messages}
            searchMessage={searchMessage}
            isGroup={conversation.no_mems ? true : false}
            block={block}
          />
        )}
        {block ? (
          <Block>
            This conversation has been blocked by{" "}
            {checkBlockHandler() ? "you" : displayBlockerName()}
          </Block>
        ) : (
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
        )}
      </ChatFormContainer>
      <ChatInfo
        toggleCloseChatInfo={toggleCloseChatInfo}
        closeChatInfo={closeChatInfo}
        messages={messages}
        conversation={conversation}
        blockGroupConversation={blockGroupConversation}
        checkGroupBlockHandler={checkGroupBlockHandler}
      ></ChatInfo>
    </>
  );
};

export default ChatForm;
