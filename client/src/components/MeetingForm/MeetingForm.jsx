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
import { useAudio } from "../Hooks/audio-hook";

function MeetingForm({ conversation }) {
  const url = `${process.env.REACT_APP_ENDPOINT_CLIENT}/sounds/calling-ring.mp3`;
  const [playing, toggle] = useAudio(url);
  console.log("MeetingForm running");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    call: { isReceivedCall, caller, callee, group },
    stream,
  } = useSelector((state) => state.video);
  const { socket_video } = useSelector((state) => state.socket);
  console.log(isReceivedCall);

  useEffect(() => {
    toggle();
  }, []);

  // useEffect(() => {
  //   if (stream && !isReceivedCall && !group) {
  //     dispatch(callUser());
  //   }
  // }, [isReceivedCall]);

  useEffect(() => {
    socket_video.on("reject-call", async ({ error }) => {
      await toggle();
      dispatch(rejectCall(navigate));

      dispatch(
        errorActions.setError({
          error,
        })
      );
    });
    socket_video.on("join-meeting-room", async () => {
      await toggle();
      navigate(`/meeting/${conversation._id}`);
    });

    return () => {
      // depend on stream (null or not)
      socket_video.off("reject-call");
      socket_video.off("join-meeting-room");
    };
  }, [playing]);

  useEffect(() => {
    if (isReceivedCall && !group) {
      dispatch(videoStreamStart(navigate, conversation));
    }
  }, []);

  const rejectCallHandler = async () => {
    await toggle();
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

  const anwserCallHandler = async () => {
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
      await toggle();
      navigate(`/meeting-group/${conversation._id}?showVideo=1`);
    }
  };

  const anwserCallWithoutVideoHandler = async () => {
    if (!group) {
      socket_video.emit("join-meeting-room", {
        conversationId: conversation._id,
        callAccepted: true,
        caller,
        callee,
      });
      dispatch(answerCall(socket_video, false));
    } else {
      await toggle();
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
                  ? caller?.profilePhoto.url
                  : callee?.profilePhoto.url
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
