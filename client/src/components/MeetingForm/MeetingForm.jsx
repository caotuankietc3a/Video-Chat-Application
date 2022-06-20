import React, { useEffect } from "react";
import {
  MeetingFormContainer,
  MeetingFormContent,
  MeetingImgLogo,
  MeetingPicture,
  MeetingBtns,
  MeetingImgWrapper,
  MeetingRoundedBtn,
} from "./StyledMeetingForm";
import {
  FiPhoneOff,
  FiVideo,
  FiPhoneIncoming,
  FiPhoneOutgoing,
} from "react-icons/fi";
import { BsTelephone } from "react-icons/bs";
import {
  videoStreamStart,
  answerCall,
  callUser,
  rejectCall,
} from "../../store/actions/video-chat-function";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function MeetingForm({ conversation }) {
  console.log("MeetingForm running");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    call: { isReceivedCall, caller, callee },
    stream,
  } = useSelector((state) => state.video);
  console.log(isReceivedCall);
  console.log(caller);
  console.log(callee);
  const { socket_video } = useSelector((state) => state.socket);

  useEffect(() => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    if (stream && !isReceivedCall) {
      dispatch(callUser());
    }

    socket_video.on("reject-call", () => {
      dispatch(rejectCall(navigate));
    });

    return () => {
      // depend on stream (null or not)
      socket_video.off("reject-call");
    };
  }, [isReceivedCall]);

  useEffect(() => {
    if (isReceivedCall) {
      dispatch(videoStreamStart(navigate, conversation));
    }
  }, []);

  useEffect(() => {
    socket_video.on("join-meeting-room", () => {
      navigate(`/meeting/${conversation._id}`);
    });
  }, []);

  const rejectCallHandler = () => {
    socket_video.emit("reject-call", {
      conversationId: conversation._id,
      callAccepted: false,
      caller,
      callee,
      date: new Date(Date.now()),
    });
  };

  const anwserCallHandler = () => {
    socket_video.emit("join-meeting-room", {
      conversationId: conversation._id,
      callAccepted: true,
      caller,
      callee,
      date: new Date(Date.now()),
    });
    dispatch(answerCall(socket_video, true));
  };

  const anwserCallWithoutVideoHandler = () => {
    socket_video.emit("join-meeting-room", {
      conversationId: conversation._id,
      callAccepted: true,
      caller,
      callee,
    });
    dispatch(answerCall(socket_video, false));
  };

  return (
    <MeetingFormContainer>
      <MeetingFormContent>
        <MeetingImgLogo>
          {isReceivedCall ? <FiPhoneIncoming /> : <FiPhoneOutgoing />}
        </MeetingImgLogo>
        <p className="title">
          {isReceivedCall ? "Incoming Call" : "Outgoing Call"}
        </p>
        <p className="name">
          {isReceivedCall ? callee.fullname : caller.fullname}
        </p>
        <MeetingPicture>
          <MeetingImgWrapper>
            <img
              src={isReceivedCall ? callee.profilePhoto : caller.profilePhoto}
              alt=""
            />
          </MeetingImgWrapper>
        </MeetingPicture>
        <MeetingBtns>
          <MeetingRoundedBtn className="close" onClick={rejectCallHandler}>
            <FiPhoneOff />
          </MeetingRoundedBtn>
          {isReceivedCall && (
            <MeetingRoundedBtn
              className="open"
              onClick={anwserCallWithoutVideoHandler}
            >
              <BsTelephone />
            </MeetingRoundedBtn>
          )}
          {isReceivedCall && (
            <MeetingRoundedBtn className="video" onClick={anwserCallHandler}>
              <FiVideo />
            </MeetingRoundedBtn>
          )}
        </MeetingBtns>
      </MeetingFormContent>
    </MeetingFormContainer>
  );
}

export default MeetingForm;
