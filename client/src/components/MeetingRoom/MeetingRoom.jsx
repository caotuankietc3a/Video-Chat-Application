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
  VideoRemotePeer,
  VideoRemotePeerImg,
  VideoRemotePeerName,
  VideoRemotePeerStatus,
  Peers,
  PeerInfo,
} from "./StyledMeetingRoom";
import { HiOutlineMicrophone } from "react-icons/hi";

const MeetingRoom = () => {
  return (
    <MeetingContainer>
      <MeetingTopControls className="transparent">
        <PannelControl>
          <FiMenu />
        </PannelControl>
        <Peers>
          <PeerInfo className="main-peer">
            <VideoRemotePeer>
              <VideoRemotePeerName fontsize="11px" padding="10px 0px">
                sdfa
              </VideoRemotePeerName>
              <VideoRemotePeerImg height="40px" width="40px">
                <img src="/images/user-img.jpg" alt="" />
              </VideoRemotePeerImg>
              <VideoRemotePeerStatus fontsize="11px" padding="10px 0px">
                sdafgsdfa
              </VideoRemotePeerStatus>
            </VideoRemotePeer>
          </PeerInfo>
        </Peers>
        <Videos>
          <video src=""></video>
        </Videos>
        <PannelControl>
          <FaChevronDown />
        </PannelControl>
      </MeetingTopControls>

      <MeetingVideoWrapper>
        <VideoRemotePeer>
          <VideoRemotePeerName height="30px" fontsize="18px" padding="0px 0px">
            sdfa
          </VideoRemotePeerName>
          <VideoRemotePeerImg height="120px">
            <img src="/images/user-img.jpg" alt="" />
          </VideoRemotePeerImg>
          <VideoRemotePeerStatus
            height="30px"
            fontsize="18px"
            padding="0px 0px"
          >
            sdafgsdfa
          </VideoRemotePeerStatus>
        </VideoRemotePeer>
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
          <FunctionControls>
            <MdGridView />
          </FunctionControls>
        </MeetingBottomControls>
      </MeetingVideoWrapper>
    </MeetingContainer>
  );
};

export default MeetingRoom;
