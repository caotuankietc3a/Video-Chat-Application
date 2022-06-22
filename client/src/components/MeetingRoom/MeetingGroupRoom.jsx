import { useState, useRef, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
  StyledVideo,
  Container,
} from "./StyledMeetingRoom";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import Peer from "./Peer/Peer";
import {
  addPeer,
  createPeer,
  videoGroupStreamStart,
} from "../../store/actions/video-group-function";
import VideoDisplay from "./Peer/VideoDisplay";
import { errorActions } from "../../store/slices/error-slice";
import { closeNotification } from "../../store/actions/error-function";
import Notification from "../Notification/Notification";

const MeetingGroupRoom = () => {
  console.log("MeetingGroupRoom running");
  const myVideo = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const { conversationId } = useParams();
  const [showTopControls, setShowTopControls] = useState(false);
  const { socket_group_video } = useSelector((state) => state.socket);
  const {
    call: { isReceivedCall },
  } = useSelector((state) => state.video);

  const { user } = useSelector((state) => state.user);
  const { notify } = useSelector((state) => state.error);
  console.log(user);
  useEffect(() => {
    (async () => {
      try {
        const stream = await videoGroupStreamStart();
        myVideo.current.srcObject = stream;
        // socket_group_video.emit("join-group-video", {
        //   conversationId: conversation._id,
        // });

        console.log("okokkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        socket_group_video.emit("join-group-video", {
          conversationId: conversationId,
        });

        socket_group_video.on("users-in-room", ({ usersInRoom }) => {
          const array_peer = [];
          usersInRoom.forEach(({ userId }) => {
            const peer = createPeer(
              userId,
              stream,
              socket_group_video.id,
              socket_group_video
            );
            array_peer.push({ peer, peerId: userId, stream });
            peersRef.current.push({ peer, peerId: userId, stream });
          });
          setPeers(array_peer);
        });

        socket_group_video.on("user-joined", ({ callerId, signal }) => {
          const peer = addPeer(signal, callerId, stream, socket_group_video);
          console.log(peer);
          peersRef.current.push({ peerId: callerId, peer, stream });
          setPeers((prePeers) => [
            ...prePeers,
            { peerId: callerId, peer, stream },
          ]);
        });

        socket_group_video.on(
          "receiving-returned-signal",
          ({ signal, calleeId }) => {
            const peerObject = peersRef.current.find(
              ({ peerId }) => peerId === calleeId
            );
            peerObject.peer.signal(signal);
          }
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    socket_group_video.on("user-leaved", ({ peerId, userName }) => {
      const index = peersRef.current.findIndex(
        (peer) => peer.peerId === peerId
      );
      if (index !== -1) {
        peersRef.current.splice(index, 1);
        setPeers((prePeers) => {
          prePeers.splice(index, 1);
          return [...prePeers];
        });
        dispatch(
          errorActions.setNotify({
            notify: `${userName} leaved this meeting room!!!`,
          })
        );
      }
    });
  }, []);

  const onClickShowTopControls = (e) => {
    setShowTopControls(!showTopControls);
  };

  const phoneOffHandler = (stream) => {
    socket_group_video.emit("leave-group-video", {
      conversationId,
      isReceivedCall,
      user,
    });
    navigate("/home-chat");
    stream?.getTracks().forEach(function (track) {
      track.stop();
    });
  };

  return (
    <MeetingContainer>
      <MeetingTopControls
        className={!showTopControls ? "" : "transparent"}
        showTop={showTopControls}
      >
        <Notification
          error={notify}
          closeNotification={() => {
            dispatch(closeNotification());
          }}
        />
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
              userImg={`/images/user-img.jpg`}
              name={"TESTUSER"}
              isTurnOnAudio={false}
            />

            {peers.map(({ peer, stream }, index) => {
              console.log(peer);
              return (
                <MyVideo showTop={true} key={index}>
                  <VideoDisplay key={index} peer={peer} stream={stream} />;
                </MyVideo>
              );
            })}
          </Peers>
        )}

        <MyVideo showTop={showTopControls}>
          <video ref={myVideo} autoPlay={true} muted={true}></video>
        </MyVideo>

        {showTopControls && (
          <PannelControl showTop={showTopControls}>
            <FaChevronDown />
          </PannelControl>
        )}
      </MeetingTopControls>

      <MeetingVideoWrapper>
        <Container showTop={showTopControls}>
          {peers.map(({ peer, stream }, index) => {
            console.log(peer);
            return (
              <StyledVideo key={index}>
                <VideoDisplay peer={peer} stream={stream} />
              </StyledVideo>
            );
          })}
        </Container>
        <MeetingBottomControls>
          <FunctionControls>
            <FiVideo />
          </FunctionControls>
          <FunctionControls>
            <AiOutlineAudio />
          </FunctionControls>
          <FunctionControls>
            <CgScreen />
          </FunctionControls>
          <FunctionControls
            className="phone_off"
            onClick={() => {
              phoneOffHandler(myVideo.current.srcObject);
            }}
          >
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

export default MeetingGroupRoom;
