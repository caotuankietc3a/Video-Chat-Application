import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { videoActions } from "../../store/slices/video-chat-slice";
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
  MyVideo,
  UserVideo,
  FunctionControls,
  Peers,
} from "./StyledMeetingRoom";
import { HiOutlineMicrophone } from "react-icons/hi";
import Peer from "./Peer/Peer";
import {
  leaveMeetingRoom,
  rejectCall,
} from "../../store/actions/video-chat-function";

const MeetingRoom = (props) => {
  console.log("MeetingRoom running");
  const [showTopControls, setShowTopControls] = useState(false);
  const userVideo = useRef(null);
  const myVideo = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket_video } = useSelector((state) => state.socket);
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);

  const { stream, userStream, showVideo, showUserVideo } = useSelector(
    (state) => state.video
  );
  const onClickShowTopControls = (e) => {
    setShowTopControls(!showTopControls);
  };
  // console.log("myVideo: ", myVideo);
  // console.log("showVideo: ", showVideo);
  // console.log("userVideo: ", userVideo);
  // console.log("showUserVideo: ", showUserVideo);
  console.log(conversation.members);
  console.log(user);

  useEffect(() => {
    if (stream) {
      if (myVideo.current) myVideo.current.srcObject = stream;
    }
    if (userStream) {
      if (userVideo.current) userVideo.current.srcObject = userStream;
    }
  }, [
    stream,
    showVideo,
    userStream,
    showUserVideo,
    myVideo.current,
    userVideo.current,
    showTopControls,
  ]);

  useEffect(() => {
    socket_video.on("leave-meeting-room", () => {
      dispatch(leaveMeetingRoom(navigate));
    });
  }, []);

  useEffect(() => {
    socket_video.on("toggle-video", () => {
      // console.log("showUserVideo: ", showUserVideo);
      dispatch(
        videoActions.setShowUserVideo({ showUserVideo: !showUserVideo })
      );
    });

    return () => {
      // depend on showVideo
      socket_video.off("toggle-video");
    };
  }, [showUserVideo]);

  const phoneOffHandler = () => {
    socket_video.emit("leave-meeting-room", {
      conversationId: conversation._id,
    });
  };

  const toggleVideoHandler = () => {
    socket_video.emit("toggle-video", {
      conversationId: conversation._id,
    });
    dispatch(videoActions.setShowVideo({ showVideo: !showVideo }));
  };

  const returnPeerHandler = (
    { type, padding, fontsize, heightImg, widthImg, isTurnOnAudio },
    conversation
  ) => {
    return conversation.members
      .filter((mem) => mem._id !== user._id)
      .map((peer, i) => (
        <Peer
          key={i}
          type={type}
          padding={padding}
          fontsize={fontsize}
          heightImg={heightImg}
          widthImg={widthImg}
          userImg={peer.profilePhoto}
          name={peer.fullname}
          isTurnOnAudio={isTurnOnAudio}
        />
      ));
  };

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
              userImg={user.profilePhoto}
              name={user.fullname}
              isTurnOnAudio={false}
            />

            {!showUserVideo ? (
              returnPeerHandler(
                {
                  type: "peer",
                  padding: "10px 0",
                  fontsize: "11px",
                  heightImg: "40px",
                  widthImg: "40px",
                  isTurnOnAudio: false,
                },
                conversation
              )
            ) : (
              <MyVideo showTop={showTopControls}>
                <video ref={userVideo} autoPlay={true} muted={true}></video>
              </MyVideo>
            )}
          </Peers>
        )}

        <MyVideo showTop={showTopControls}>
          {showVideo && (
            <video ref={myVideo} autoPlay={true} muted={true}></video>
          )}
        </MyVideo>

        {showTopControls && (
          <PannelControl showTop={showTopControls}>
            <FaChevronDown />
          </PannelControl>
        )}
      </MeetingTopControls>

      <MeetingVideoWrapper>
        {showUserVideo ? (
          showTopControls ? (
            returnPeerHandler(
              {
                type: "main-screen-peer",
                padding: "0 0",
                fontsize: "18px",
                heightImg: "120px",
                widthImg: "120px",
                isTurnOnAudio: false,
              },
              conversation
            )
          ) : (
            <UserVideo>
              <video ref={userVideo} autoPlay={true} muted={true}></video>
            </UserVideo>
          )
        ) : (
          returnPeerHandler(
            {
              type: "main-screen-peer",
              padding: "0 0",
              fontsize: "18px",
              heightImg: "120px",
              widthImg: "120px",
              isTurnOnAudio: false,
            },
            conversation
          )
        )}

        <MeetingBottomControls>
          <FunctionControls onClick={toggleVideoHandler}>
            {showVideo ? <FiVideo /> : <FiVideoOff />}
          </FunctionControls>
          <FunctionControls>
            <HiOutlineMicrophone />
          </FunctionControls>
          <FunctionControls>
            <CgScreen />
          </FunctionControls>
          <FunctionControls className="phone_off" onClick={phoneOffHandler}>
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
