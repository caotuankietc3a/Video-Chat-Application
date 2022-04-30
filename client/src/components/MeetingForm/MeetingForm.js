import React, { useEffect, useRef } from "react";
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
} from "../../store/video-chat-function";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { videoActions } from "../../store/video-chat-slice";

function MeetingForm(props) {
  console.log("MeetingForm running");
  const userVideo = useRef();
  const myVideo = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connection = useRef();
  const {
    call: { isReceivedCall, caller, callee },
    signal,
    stream,
  } = useSelector((state) => state.video);
  const { socket_video, conversation } = props;

  useEffect(() => {
    dispatch(
      videoStreamStart((currentStream) => {
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      })
    );
  }, []);

  useEffect(() => {
    if (stream) {
      dispatch(
        callUser(
          socket_video,
          (currentStream) => {
            userVideo.current.srcObject = currentStream;
          },
          (peer) => {
            connection.current = peer;
          }
        )
      );
    }
    // return () => {
    // console.log("Set stream to null!!!");
    // dispatch(videoActions.setStream({ stream: null }));
    // };
  }, [stream]);

  useEffect(() => {
    socket_video.on("call-user", ({ signal }) =>
      dispatch(videoActions.setSignal({ signal }))
    );

    socket_video.on("reject-call", () => {
      dispatch(rejectCall(navigate, stream));
    });
  }, []);

  const rejectCallHandler = () => {
    socket_video.emit("reject-call", { conversationId: conversation._id });
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
            <MeetingRoundedBtn className="open">
              <BsTelephone />
            </MeetingRoundedBtn>
          )}
          {isReceivedCall && (
            <MeetingRoundedBtn className="video">
              <FiVideo />
            </MeetingRoundedBtn>
          )}
        </MeetingBtns>
      </MeetingFormContent>
    </MeetingFormContainer>
  );
}

export default MeetingForm;
