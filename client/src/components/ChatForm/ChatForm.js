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
  const { conversation, user, socket } = props;
  // const { call, callAccepted, callEnded, stream, name } = useSelector(
  //   (state) => state.video
  // );

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
    socket.emit("join-message", { conversationId: conversation._id });

    socket.on("message", ({ text, userId }) => {
      setMessages((preMessages) => [
        ...preMessages,
        {
          text: text,
          senderId: userId,
          date: new Date(Date.now()),
        },
      ]);
    });
    // socket.on("accept-call", () => {
    // });
    return function cleanup() {
      // dispatch(videoActions.setStream({stream: null}));
      // socket.emit("leave-message", { conversationId: conversation._id });
      // socket.off();
    };
  }, []);

  // useEffect(() => {
  // if (stream) dispatch(callUser(socket, userVideo, connection));
  // }, [stream]);

  const onClickHandler = async (e) => {
    e.preventDefault();
    if (message) {
      const oldMes = message;
      socket.emit("sendMessage", {
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
    // dispatch(videoStreamStart(myVideo));
    // if (stream) dispatch(callUser(socket, userVideoCb, connectionCb));
    socket.emit(
      "make-connection-call",
      { conversationId: conversation._id, caller: user },
      (callee) => {
        dispatch(
          videoActions.setCall({
            call: {
              isRecievedCall: false,
              caller: user,
              callee: callee,
              signal: null,
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
      {
        // stream && <video ref={myVideo} autoPlay={true} muted={true}></video>
        // <video ref={myVideo} autoPlay={true} muted={true}></video>
      }
      {
        // callAccepted && !callEnded && <video ref={userVideo} autoPlay={true} muted={true}></video>
        // < button onClick={() => dispatch(answerCall(socket, userVideo, connection))}>button
        // </button>
      }
    </ChatFormContainer>
  );
};

export default ChatForm;
