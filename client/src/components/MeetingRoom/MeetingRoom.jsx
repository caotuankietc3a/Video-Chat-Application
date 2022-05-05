import {
  FiMenu,
  FiVideo,
  FiVideoOff,
  FiPhone,
  FiPhoneOff,
  FiUserPlus,
} from "react-icons/fi";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { CgScreen } from "react-icons/cg";
import {
  MeetingContainer,
  MeetingVideoWrapper,
  MeetingTopControls,
  MeetingBottomControls,
  PannelControl,
  Videos,
  FunctionControls,
  VideoRemotePeer,
  VideoRemotePeerImg,
  VideoRemotePeerName,
  VideoRemotePeerStatus,
} from "./StyledMeetingRoom";

const MeetingRoom = () => {
  return (
    <MeetingContainer>
      <MeetingTopControls>
        <PannelControl>
          <FiMenu />
        </PannelControl>
        <Videos>
          <video src=""></video>
        </Videos>
      </MeetingTopControls>

      <MeetingVideoWrapper>
        <VideoRemotePeer>
          <VideoRemotePeerName>sdfa</VideoRemotePeerName>
          <VideoRemotePeerImg>
            <img src="/images/user-img.jpg" alt="" />
          </VideoRemotePeerImg>
          <VideoRemotePeerStatus>sdafgsdfa</VideoRemotePeerStatus>
        </VideoRemotePeer>
        <MeetingBottomControls>
          <FunctionControls>
            <FiVideo />
          </FunctionControls>
          <FunctionControls>
            <BiMicrophone />
          </FunctionControls>
          <FunctionControls>
            <FiPhoneOff />
          </FunctionControls>
          <FunctionControls>
            <FiUserPlus />
          </FunctionControls>
        </MeetingBottomControls>
      </MeetingVideoWrapper>
    </MeetingContainer>
  );
};

export default MeetingRoom;
