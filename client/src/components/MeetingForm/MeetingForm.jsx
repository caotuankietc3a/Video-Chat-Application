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
import { errorActions } from "../../store/slices/error-slice";
import { videoActions } from "../../store/slices/video-chat-slice";

function MeetingForm({ conversation }) {
  console.log("MeetingForm running");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    call: { isReceivedCall, caller, callee, group },
    stream,
  } = useSelector((state) => state.video);
  // console.log(user);
  // console.log(isReceivedCall);
  // console.log(callee);
  // console.log(group);
  const { socket_video } = useSelector((state) => state.socket);

  useEffect(() => {
    if (stream && !isReceivedCall) {
      dispatch(callUser());
    }

    socket_video.on("reject-call", ({ error }) => {
      dispatch(rejectCall(navigate));

      dispatch(
        errorActions.setError({
          error,
        })
      );
    });

    return () => {
      // depend on stream (null or not)
      socket_video.off("reject-call");
    };
  }, [isReceivedCall]);

  useEffect(() => {
    if (isReceivedCall && !group) {
      dispatch(videoStreamStart(navigate, conversation));
    }
  }, []);

  useEffect(() => {
    socket_video.on("join-meeting-room", () => {
      navigate(`/meeting/${conversation._id}`);
    });
  }, []);

  const rejectCallHandler = () => {
    if (!group) {
      socket_video.emit("reject-call", {
        conversationId: conversation._id,
        isReceivedCall,
        callAccepted: false,
        caller,
        callee,
        date: new Date(Date.now()),
      });

      dispatch(rejectCall(navigate));
    } else {
      navigate(`/home-chat`);
    }
  };

  const anwserCallHandler = () => {
    if (!group) {
      socket_video.emit("join-meeting-room", {
        conversationId: conversation._id,
        callAccepted: true,
        caller,
        callee,
        date: new Date(Date.now()),
      });
      dispatch(answerCall(socket_video, true));
    } else {
      navigate(`/meeting-group/${conversation._id}?showVideo=1`);
    }
  };

  const anwserCallWithoutVideoHandler = () => {
    if (!group) {
      socket_video.emit("join-meeting-room", {
        conversationId: conversation._id,
        callAccepted: true,
        caller,
        callee,
      });
      dispatch(answerCall(socket_video, false));
    } else {
      navigate(`/meeting-group/${conversation._id}?showVideo=0`);
    }
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
          {group
            ? group?.groupName
            : isReceivedCall
            ? caller?.fullname
            : callee?.fullname}
        </p>
        <MeetingPicture>
          <MeetingImgWrapper>
            <img
              src={
                group
                  ? group?.groupImg
                  : isReceivedCall
                  ? callee?.profilePhoto.url
                  : caller?.profilePhoto.url
              }
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
