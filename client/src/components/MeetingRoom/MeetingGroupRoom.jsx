import { useState, useRef, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [showTopControls, setShowTopControls] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const { socket_group_video } = useSelector((state) => state.socket);
  const {
    call: { isReceivedCall },
  } = useSelector((state) => state.video);

  const { user } = useSelector((state) => state.user);
  const { notify } = useSelector((state) => state.error);
  useEffect(() => {
    (async () => {
      try {
        const stream = await videoGroupStreamStart();
        const isShowVideo = parseInt(searchParams.get("showVideo"));
        setShowVideo(isShowVideo ? true : false);

        myVideo.current.srcObject = stream;

        socket_group_video.emit("join-group-video", {
          conversationId: conversationId,
          userName: user ? user.fullname : "TEST USER",
          userImg: user ? user.profilePhoto : "/images/user-img.jpg",
          userShowVideo: isShowVideo ? true : false,
          userMuted: false,
        });

        socket_group_video.on("users-in-room", ({ usersInRoom }) => {
          const array_peer = [];
          usersInRoom.forEach(
            ({
              userInfo: { userId, userName, userImg, userShowVideo, userMuted },
            }) => {
              const peer = createPeer(
                userId,
                stream,
                conversationId,
                socket_group_video.id,
                socket_group_video
              );
              const peerObject = {
                peer,
                peerInfo: {
                  peerId: userId,
                  peerName: userName,
                  peerImg: userImg,
                  peerShowVideo: userShowVideo,
                  peerMuted: userMuted,
                },
                stream,
              };

              array_peer.push(peerObject);
              peersRef.current.push(peerObject);
            }
          );
          setPeers(array_peer);
        });

        socket_group_video.on(
          "user-joined",
          ({
            callerInfo: {
              callerId,
              callerName,
              callerImg,
              callerShowVideo,
              callerMuted,
            },
            signal,
          }) => {
            const peer = addPeer(signal, callerId, stream, socket_group_video);
            const peerObject = {
              peerInfo: {
                peerId: callerId,
                peerName: callerName,
                peerImg: callerImg,
                peerShowVideo: callerShowVideo,
                peerMuted: callerMuted,
              },
              peer,
              stream,
            };
            peersRef.current.push(peerObject);
            setPeers((prePeers) => [...prePeers, peerObject]);

            dispatch(
              errorActions.setNotify({
                notify: `${callerName} joined this meeting room!!!`,
              })
            );
          }
        );

        socket_group_video.on(
          "receiving-returned-signal",
          ({ signal, calleeId }) => {
            const peerObject = peersRef.current.find(
              ({ peerInfo }) => peerInfo.peerId === calleeId
            );
            peerObject.peer.signal(signal);
          }
        );
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      dispatch(errorActions.setErrorNotify());
    };
  }, []);

  useEffect(() => {
    socket_group_video.on("user-leaved", ({ peerId, userInfo }) => {
      const index = peersRef.current.findIndex(
        (peer) => peer.peerInfo.peerId === peerId
      );
      if (index !== -1) {
        peersRef.current.splice(index, 1);
        setPeers((prePeers) => {
          prePeers.splice(index, 1);
          return [...prePeers];
        });
        dispatch(
          errorActions.setNotify({
            notify: `${userInfo?.userName} leaved this meeting room!!!`,
          })
        );
      }
    });
    socket_group_video.on("toggle-group-video", ({ peerId }) => {
      const peerObj = peersRef.current.find(
        (peer) => peer.peerInfo.peerId === peerId
      );
      peerObj.peerInfo.peerShowVideo = !peerObj.peerInfo.peerShowVideo;
      setPeers([...peersRef.current]);
    });
  }, []);

  const onClickShowTopControls = (e) => {
    setShowTopControls(!showTopControls);
  };

  const phoneOffHandler = (stream) => {
    socket_group_video.emit("leave-group-video", {
      conversationId,
      isReceivedCall,
    });
    navigate("/home-chat");
    stream?.getTracks().forEach(function (track) {
      track.stop();
    });
  };

  const toggleGroupVideoHandler = () => {
    setShowVideo(!showVideo);
    socket_group_video.emit("toggle-group-video", {
      conversationId,
    });
  };

  const returnPeerHandler = (
    {
      type,
      padding,
      fontsize,
      heightImg,
      margin,
      widthImg,
      width,
      height,
      isTurnOnAudio = false,
    },
    peers
  ) => {
    return peers.map(
      (
        {
          peer,
          stream,
          peerInfo: { peerShowVideo, peerMuted, peerName, peerImg },
        },
        index
      ) => (
        <Fragment key={index}>
          {peerShowVideo ? (
            <StyledVideo>
              <VideoDisplay peer={peer} stream={stream} />
            </StyledVideo>
          ) : (
            <Peer
              type={type}
              padding={padding}
              fontsize={fontsize}
              width={width}
              margin={margin}
              height={height}
              heightImg={heightImg}
              widthImg={widthImg}
              userImg={peerImg}
              name={peerName}
              isTurnOnAudio={isTurnOnAudio}
            />
          )}
        </Fragment>
      )
    );
  };

  // {/* <MyVideo> */}
  // {/*   <VideoDisplay peer={peer} stream={stream} /> */}
  // {/* </MyVideo> */}

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

            {peers.map(
              (
                { peer, stream, peerInfo: { peerShowVideo, peerMuted } },
                index
              ) => {
                return (
                  <MyVideo showTop={true} key={index}>
                    <VideoDisplay key={index} peer={peer} stream={stream} />
                  </MyVideo>
                );
              }
            )}
          </Peers>
        )}

        <MyVideo showTop={showTopControls}>
          <video ref={myVideo} autoPlay={true} muted={true}></video>

          {/* {!showVideo && ( */}
          {/*   <video ref={myVideo} autoPlay={false} muted={true}></video> */}
          {/* )} */}
        </MyVideo>

        {showTopControls && (
          <PannelControl showTop={showTopControls}>
            <FaChevronDown />
          </PannelControl>
        )}
      </MeetingTopControls>

      <MeetingVideoWrapper>
        <Container showTop={showTopControls}>
          {returnPeerHandler(
            {
              type: "main-screen-peer",
              height: "405px",
              width: "719px",
              margin: "20px",
              padding: "0 0",
              fontsize: "18px",
              heightImg: "120px",
              widthImg: "120px",
              isTurnOnAudio: false,
            },
            peers
          )}
        </Container>
        <MeetingBottomControls>
          <FunctionControls onClick={toggleGroupVideoHandler}>
            {showVideo ? <FiVideo /> : <FiVideoOff />}
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
