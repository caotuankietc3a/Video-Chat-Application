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
} from "../../store/actions/video-chat-function";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { videoActions } from "../../store/slices/video-chat-slice";

function MeetingForm(props) {
  console.log("MeetingForm running");
  const userVideo = useRef();
  const myVideo = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connection = useRef();
  const {
    call: { isReceivedCall, caller, callee },
    stream,
    callAccepted,
    callEnded,
  } = useSelector((state) => state.video);
  const { socket_video, conversation } = props;

  useEffect(() => {
    dispatch(
      videoStreamStart((currentStream) => {
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      })
    );
  }, [callAccepted]);

  useEffect(() => {
    if (stream && !isReceivedCall) {
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

    socket_video.on("reject-call", () => {
      dispatch(rejectCall(navigate, stream, connection));
    });

    return () => {
      // dispatch(videoActions.setStream({ stream: null }));
      socket_video.off("reject-call");
    };
  }, [stream]);

  useEffect(() => {
    socket_video.on("call-user", ({ signal }) =>
      dispatch(videoActions.setSignal({ signal }))
    );
  }, []);

  const rejectCallHandler = () => {
    socket_video.emit("reject-call", { conversationId: conversation._id });
  };

  const anwserCallHandler = () => {
    dispatch(
      answerCall(
        socket_video,
        (currentStream) => {
          userVideo.current.srcObject = currentStream;
        },
        (peer) => {
          connection.current = peer;
        }
      )
    );
  };

  const myVideoDisplay = stream && (
    <video ref={myVideo} autoPlay={true} muted={true}></video>
  );
  const userVideoDisplay = !callEnded && (
    <video ref={userVideo} autoPlay={true} muted={true}></video>
  );

  return !callAccepted ? (
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
            <MeetingRoundedBtn className="video" onClick={anwserCallHandler}>
              <FiVideo />
            </MeetingRoundedBtn>
          )}
        </MeetingBtns>
      </MeetingFormContent>
    </MeetingFormContainer>
  ) : (
    <>
      {myVideoDisplay}
      {userVideoDisplay}
    </>
  );
}

export default MeetingForm;
