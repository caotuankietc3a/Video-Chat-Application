import { useState, useRef, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { videoActions } from "../../store/slices/video-chat-slice";
import { FiMenu, FiVideo, FiVideoOff, FiPhoneOff } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
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
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import Peer from "./Peer/Peer";
import {
  leaveMeetingRoom,
  shareScreen,
} from "../../store/actions/video-chat-function";

const MeetingRoom = () => {
  console.log("MeetingRoom running");
  const [showTopControls, setShowTopControls] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [muted, setMuted] = useState(false);
  const [toggleMuted, setToggleMuted] = useState(false);
  const userVideo = useRef(null);
  const myVideo = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket_video } = useSelector((state) => state.socket);
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);

  const {
    stream,
    userStream,
    showVideo,
    showUserVideo,
    call: { callee, caller },
  } = useSelector((state) => state.video);
  const onClickShowTopControls = (e) => {
    setShowTopControls(!showTopControls);
  };

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
    showTopControls,
    toggleMuted,
    muted,
  ]);

  useEffect(() => {
    socket_video.on("leave-meeting-room", () => {
      dispatch(leaveMeetingRoom(navigate));
    });
  }, []);

  useEffect(() => {
    socket_video.on("toggle-video", () => {
      dispatch(
        videoActions.setShowUserVideo({ showUserVideo: !showUserVideo })
      );
    });

    socket_video.on("toggle-muted", () => {
      setMuted(!muted);
    });

    return () => {
      // depend on showUserVideo and muted
      socket_video.off("toggle-video");
      socket_video.off("toggle-muted");
    };
  }, [showUserVideo, muted]);

  const phoneOffHandler = () => {
    socket_video.emit("leave-meeting-room", {
      conversationId: conversation._id,
      callerId: caller._id,
      calleeId: callee._id,
    });
  };

  const toggleVideoHandler = () => {
    socket_video.emit("toggle-video", {
      conversationId: conversation._id,
    });
    dispatch(videoActions.setShowVideo({ showVideo: !showVideo }));
  };

  const returnPeerHandler = (
    { type, padding, fontsize, heightImg, widthImg },
    members,
    isShowTop = false
  ) => {
    return members.map((peer, i) => (
      <Fragment key={i}>
        {isShowTop ? (
          <>
            <Peer
              type={type}
              padding={padding}
              fontsize={fontsize}
              heightImg={heightImg}
              widthImg={widthImg}
              userImg={peer.user.profilePhoto.url}
              name={peer.user.fullname}
              displayText={
                showUserVideo
                  ? muted
                    ? "Video Only!"
                    : "Both Video and Audio!"
                  : !muted
                  ? "Audio Only!"
                  : "Spectator"
              }
            />
            <video ref={userVideo} autoPlay={true} muted={muted}></video>
          </>
        ) : !showUserVideo ? (
          <Fragment>
            <Peer
              type={type}
              padding={padding}
              fontsize={fontsize}
              heightImg={heightImg}
              widthImg={widthImg}
              userImg={peer.user.profilePhoto.url}
              name={peer.user.fullname}
              displayText={
                !showUserVideo && muted ? "Spectator" : "Audio Only!"
              }
            />
            <video ref={userVideo} autoPlay={true} muted={muted}></video>
          </Fragment>
        ) : (
          <UserVideo isFullScreen={isFullScreen}>
            <video ref={userVideo} autoPlay={true} muted={muted}></video>
          </UserVideo>
        )}
      </Fragment>
    ));
  };

  const returnPeersOnTopControl = (members) => {
    return members.map((member, index) => {
      return (
        <Fragment key={index}>
          {showUserVideo ? (
            <MyVideo showTop={showTopControls}>
              <video ref={userVideo} autoPlay={true} muted={true}></video>
            </MyVideo>
          ) : (
            <Peer
              type="peer"
              padding="10px 0"
              fontsize="11px"
              heightImg="40px"
              widthImg="40px"
              userImg={member.user.profilePhoto.url}
              name={member.user.fullname}
              displayText={
                !showUserVideo && muted ? "Spectator" : "Audio Only!"
              }
            />
          )}
        </Fragment>
      );
    });
  };

  const makeFullScreen = (e) => {
    setIsFullScreen(!isFullScreen);
  };

  const makeMutedAudio = (e) => {
    socket_video.emit("toggle-muted", { conversationId: conversation._id });
    setToggleMuted(!toggleMuted);
  };

  const shareScreenHandler = async () => {
    dispatch(shareScreen());
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
            {/* <Peer */}
            {/*   type="main-peer" */}
            {/*   padding="10px 0" */}
            {/*   fontsize="11px" */}
            {/*   heightImg="40px" */}
            {/*   widthImg="40px" */}
            {/*   userImg={user.profilePhoto} */}
            {/*   name={user.fullname} */}
            {/*   isTurnOnAudio={false} */}
            {/* /> */}
            {returnPeersOnTopControl(
              conversation.members.filter(
                (member) => member.user.fullname !== user.fullname
              )
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
        {returnPeerHandler(
          {
            type: "main-screen-peer",
            padding: "0 0",
            fontsize: "18px",
            heightImg: "120px",
            widthImg: "120px",
            isTurnOnAudio: false,
          },
          conversation.members.filter(
            (member) => member.user.fullname !== user.fullname
          ),
          showTopControls
        )}

        <MeetingBottomControls>
          <FunctionControls onClick={toggleVideoHandler}>
            {showVideo ? <FiVideo /> : <FiVideoOff />}
          </FunctionControls>
          <FunctionControls onClick={makeMutedAudio}>
            {!toggleMuted ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
          </FunctionControls>
          <FunctionControls onClick={shareScreenHandler}>
            <CgScreen />
          </FunctionControls>
          <FunctionControls className="phone_off" onClick={phoneOffHandler}>
            <FiPhoneOff />
          </FunctionControls>
          <FunctionControls onClick={makeFullScreen}>
            {isFullScreen ? <RiFullscreenFill /> : <RiFullscreenExitFill />}
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
