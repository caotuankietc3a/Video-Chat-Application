import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiMenu,
  FiVideo,
  FiVideoOff,
  FiPhone,
  FiPhoneOff,
  FiUserPlus,
} from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { CgScreen } from "react-icons/cg";
import { VscSplitHorizontal } from "react-icons/vsc";
import { MdGridView } from "react-icons/md";
import { RiFullscreenFill, RiFullscreenExitFill } from "react-icons/ri";
import {
  MeetingContainer,
  MeetingVideoWrapper,
  MeetingTopControls,
  MeetingBottomControls,
  PannelControl,
  Videos,
  FunctionControls,
  Peers,
} from "./StyledMeetingRoom";
import { HiOutlineMicrophone } from "react-icons/hi";
import Peer from "./Peer/Peer";

const MeetingRoom = () => {
  const [showTopControls, setShowTopControls] = useState(false);
  const userVideo = useRef();
  const myVideo = useRef();
  const {
    call: { isReceivedCall, caller, callee, signal },
    stream,
    callAccepted,
    callEnded,
    connection,
    userStream,
  } = useSelector((state) => state.video);
  const onClickShowTopControls = (e) => {
    setShowTopControls(!showTopControls);
  };

  useEffect(() => {
    console.log(userStream);
    console.log(stream);
    if (userStream) userVideo.current.srcObject = userStream;
    if (stream) myVideo.current.srcObject = stream;
  }, [userStream, stream]);

  return (
    <MeetingContainer>
      <MeetingTopControls
        className={!showTopControls ? "" : "transparent"}
        showTop={showTopControls}
      >
        {showTopControls && (
          <PannelControl showTop={showTopControls}>
            <FiMenu />
          </PannelControl>
        )}

        {showTopControls && (
          <Peers>
            <Peer
              type="main-peer"
              padding="10px 0"
              fontsize="11px"
              heightImg="40px"
              widthImg="40px"
              userImg="/images/user-img.jpg"
            />
          </Peers>
        )}

        <Videos showTop={showTopControls}>
          <video ref={myVideo} autoPlay={true} muted={true}></video>
        </Videos>

        {showTopControls && (
          <PannelControl showTop={showTopControls}>
            <FaChevronDown />
          </PannelControl>
        )}
      </MeetingTopControls>

      <MeetingVideoWrapper>
        <Peer
          type="main-screen-peer"
          padding="0 0"
          fontsize="18px"
          heightImg="120px"
          widthImg="120px"
          userImg="/images/user-img.jpg"
        />

        <Videos showTop={!showTopControls}>
          <video ref={userVideo} autoPlay={true} muted={true}></video>
        </Videos>
        <MeetingBottomControls>
          <FunctionControls>
            <FiVideo />
          </FunctionControls>
          <FunctionControls>
            <HiOutlineMicrophone />
          </FunctionControls>
          <FunctionControls>
            <CgScreen />
          </FunctionControls>
          <FunctionControls className="phone_off">
            <FiPhoneOff />
          </FunctionControls>
          <FunctionControls>
            <FiUserPlus />
          </FunctionControls>
          <FunctionControls>
            <RiFullscreenFill />
          </FunctionControls>
          <FunctionControls onClick={onClickShowTopControls}>
            {!showTopControls ? <MdGridView /> : <VscSplitHorizontal />}
          </FunctionControls>
        </MeetingBottomControls>
      </MeetingVideoWrapper>
    </MeetingContainer>
  );
};

export default MeetingRoom;
