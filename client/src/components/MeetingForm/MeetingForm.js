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
} from "../../store/video-chat-function";
import { useSelector, useDispatch } from "react-redux";
import { videoActions } from "../../store/video-chat-slice";

function MeetingForm(props) {
  const userVideo = useRef();
  const myVideo = useRef();
  const dispatch = useDispatch();
  const connection = useRef();
  const { socket } = useSelector((state) => state.socket);
  const {
    call: { isRecievedCall, caller, callee, signal },
  } = props;
  useEffect(() => {
    // dispatch(videoStreamStart((currentStream) => {
    //    if (myVideo.current) myVideo.current.srcObject = currentStream;
    // socket.emit("make-connection-call", {conversationId: conversation._id});
    // }));
  }, []);

  // useEffect(() => {
  //    if (stream) {
  //       dispatch(callUser(socket, (currentStream) => {
  //          userVideo.current.srcObject = currentStream;
  //       }, (peer) => {
  //          connection.current = peer;
  //       }));
  //    }

  // return () => {
  //    dispatch(videoActions.setStream({stream: null}));
  // }
  // }, [stream]);
  // useEffect(() => {
  //    socket.on("callUser", ({from, name: callerName, signal}) => {
  //       dispatch(videoActions.setCall({call: {isRecievedCall: true, from, name: callerName, signal}}));
  //    });
  // }, []);
  return (
    <MeetingFormContainer>
      <MeetingFormContent>
        <MeetingImgLogo>
          {isRecievedCall ? <FiPhoneIncoming /> : <FiPhoneOutgoing />}
        </MeetingImgLogo>
        <p className="title">
          {isRecievedCall ? "Incoming Call" : "Outgoing Call"}
        </p>
        <p className="name">
          {isRecievedCall ? callee.fullname : caller.fullname}
        </p>
        <MeetingPicture>
          <MeetingImgWrapper>
            <img
              src={isRecievedCall ? callee.profilePhoto : caller.profilePhoto}
              alt=""
            />
          </MeetingImgWrapper>
        </MeetingPicture>
        <MeetingBtns>
          <MeetingRoundedBtn className="close">
            <FiPhoneOff />
          </MeetingRoundedBtn>
          {isRecievedCall && (
            <MeetingRoundedBtn className="open">
              <BsTelephone />
            </MeetingRoundedBtn>
          )}
          {isRecievedCall && (
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
