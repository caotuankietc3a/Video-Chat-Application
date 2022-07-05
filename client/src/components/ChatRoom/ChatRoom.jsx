import { MainLayOut, Container, ChatBodyContainer } from "./StyledChatRoom";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ChatForm from "../ChatForm/ChatForm";
import { useSelector, useDispatch } from "react-redux";
import ChatContact from "./ChatContact/ChatContact";
import FriendForm from "../FriendForm/FriendForm";
import CallForm from "../CallForm/CallForm";
import MeetingForm from "../MeetingForm/MeetingForm";
import { fetchFriends, fetchUserLogin } from "../../store/actions/fetch-action";
import { conversationActions } from "../../store/slices/conversation-slice";
import { videoActions } from "../../store/slices/video-chat-slice";
import NavBarContact from "../NavBarContact/NavBarContact";
import User from "../User/User";
import FriendList from "../FriendList/FriendList";
import { forwardActions } from "../../store/slices/forward-slice";
import Notification from "../Notification/Notification";
import Profile from "../Profile/Profile";
import Settings from "../Profile/Settings/Settings.jsx";
import Portal from "../Portal/Portal";
import { closeNotification } from "../../store/actions/error-function";
const ChatRoom = (props) => {
  console.log("ChatRoom running");
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.error);
  const { forward } = useSelector((state) => state.forward);
  const callState = useSelector((state) => state.call);
  const { friend } = useSelector((state) => state.friend);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isClickedConversation, setIsClickedConversation] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const { socket_chat, socket_video, socket_notify } = useSelector(
    (state) => state.socket
  );

  const isClickedHandler = () => {
    setIsClickedConversation(true);
  };

  const createGroupHandler = () => {
    setCreateGroup(!createGroup);
  };

  const isClosedHandler = () => {
    setIsClickedConversation(false);
    setCreateGroup(false);
    dispatch(forwardActions.setForward({ forward: null }));
  };

  useEffect(() => {
    dispatch(fetchUserLogin(navigate, 1));
  }, []);

  useEffect(() => {
    socket_video.on(
      "make-connection-call",
      ({ conversationId, conversation, caller, callee }) => {
        dispatch(
          conversationActions.setConversation({
            conversation: {
              _id: conversation._id,
              members: conversation.members,
              name: caller.fullname,
              profilePhoto: caller.profilePhoto,
            },
          })
        );
        dispatch(
          videoActions.setCall({
            call: {
              isReceivedCall: true,
              caller,
              callee,
              signal: null,
            },
          })
        );

        setTimeout(() => {
          navigate(`/home-chat/meetings/${conversationId}`);
        }, 1000);
      }
    );

    socket_video.on(
      "make-group-connection-call",
      ({ conversationId, conversation, callerId }) => {
        dispatch(
          conversationActions.setConversation({
            conversation: {
              _id: conversation._id,
              members: conversation.members,
              name: conversation.name,
              profilePhoto: conversation.profilePhoto,
            },
          })
        );
        dispatch(
          videoActions.setCall({
            call: {
              isReceivedCall: true,
              callerId,
              group: {
                groupName: conversation.name,
                groupImg: conversation.profilePhoto,
              },
            },
          })
        );

        setTimeout(() => {
          navigate(`/home-chat/meetings/${conversationId}`);
        }, 500);
      }
    );

    socket_video.on("call-user", ({ signal }) => {
      // set showUserVideo to callee.
      dispatch(videoActions.setShowUserVideo({ showUserVideo: false }));
      // set signal to callee.
      dispatch(videoActions.setSignal({ signal }));
    });
  }, []);

  useEffect(() => {
    socket_notify.on("log-out", () => {
      dispatch(fetchFriends());
    });

    socket_notify.on("post-new-conversation", () => {
      dispatch(fetchFriends());
    });

    socket_notify.on("post-new-group-conversation", () => {
      dispatch(fetchFriends());
    });

    socket_notify.on("log-in", () => {
      dispatch(fetchFriends());
    });
  }, [friend]);

  useEffect(() => {
    if (createGroup) dispatch(fetchFriends());
  }, [createGroup]);

  useEffect(() => {
    if (user) dispatch(fetchFriends());
  }, [user]);

  useEffect(() => {
    if (forward || isClickedConversation) dispatch(fetchFriends(true));
  }, [forward, isClickedConversation]);

  return (
    <Container>
      <MainLayOut>
        {isClickedConversation || forward ? (
          <Portal>
            <FriendList isClosedHandler={isClosedHandler} friends={friend} />
          </Portal>
        ) : (
          createGroup && (
            <Portal>
              <FriendList
                isClosedHandler={isClosedHandler}
                friends={friend}
                createGroup={createGroup}
                error={error}
              />
            </Portal>
          )
        )}
        <NavBarContact />
        <Routes>
          <Route
            path={`/*`}
            element={
              <ChatContact
                header="Chats"
                isClickedHandler={isClickedHandler}
                createGroupHandler={createGroupHandler}
              />
            }
          ></Route>
          <Route
            path={`/friends/*`}
            element={
              <ChatContact
                header="Friends"
                isClickedHandler={isClickedHandler}
                createGroupHandler={createGroupHandler}
              />
            }
          ></Route>
          <Route
            path={`/calls/*`}
            element={
              <ChatContact
                header="Calls"
                isClickedHandler={isClickedHandler}
                createGroup={createGroup}
              />
            }
          ></Route>
          <Route path={`/profile/*`} element={<Profile />}></Route>
        </Routes>
        <ChatBodyContainer>
          <Routes>
            <Route
              path={`/conversation/detail/${conversation?._id}`}
              element={
                <ChatForm
                  conversation={conversation}
                  user={user}
                  socket_chat={socket_chat}
                  socket_video={socket_video}
                />
              }
            ></Route>
            <Route
              path={`/friends/friend/detail/${friend?._id}`}
              element={<FriendForm friendDetail={friend} />}
            ></Route>
            <Route
              path={`/meetings/${conversation?._id}`}
              element={
                <MeetingForm
                  socket_video={socket_video}
                  conversation={conversation}
                />
              }
            ></Route>
            <Route
              path={`/calls/call/detail/${callState?.meeting?.meetingId}`}
              element={
                <CallForm
                  calls={callState?.calls}
                  callee={callState?.meeting?.callee}
                />
              }
            ></Route>

            <Route path={`/profile/*`} element={<Settings />}></Route>

            <Route
              path={`/`}
              element={<User user={user} isClickedHandler={isClickedHandler} />}
            ></Route>
            <Route
              path={`/friends`}
              element={<User user={user} isClickedHandler={isClickedHandler} />}
            ></Route>
            <Route
              path={`/calls`}
              element={<User user={user} isClickedHandler={isClickedHandler} />}
            ></Route>
          </Routes>

          <Notification
            error={error}
            closeNotification={() => {
              dispatch(closeNotification());
            }}
          />
        </ChatBodyContainer>
      </MainLayOut>
    </Container>
  );
};

export default ChatRoom;
