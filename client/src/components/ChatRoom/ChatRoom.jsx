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
const ChatRoom = (props) => {
  console.log("ChatRoom running");
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.video);
  const { forward } = useSelector((state) => state.forward);
  const callState = useSelector((state) => state.call);
  const { friend } = useSelector((state) => state.friend);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isClickedConversation, setIsClickedConversation] = useState(false);
  const { socket_chat, socket_video } = useSelector((state) => state.socket);

  const closeNotification = () => {
    dispatch(
      videoActions.setError({
        error: null,
      })
    );
  };

  const isClickedHandler = () => {
    setIsClickedConversation(true);
  };

  const isClosedHandler = () => {
    setIsClickedConversation(false);
    dispatch(forwardActions.setForward({ forward: null }));
  };

  useEffect(() => {
    dispatch(fetchUserLogin(navigate, socket_video));
  }, []);

  useEffect(() => {
    socket_video.on(
      "make-connection-call",
      ({ conversationId, conversation, caller, callee }) => {
        dispatch(conversationActions.setConversation({ conversation }));
        dispatch(
          videoActions.setCall({
            call: { isReceivedCall: true, caller, callee, signal: null },
          })
        );
        setTimeout(() => {
          navigate(`/home-chat/meetings/${conversationId}`);
        }, 1000);
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
    dispatch(fetchFriends());
  }, [user]);

  return (
    <Container>
      <MainLayOut>
        {isClickedConversation ? (
          <FriendList
            isClosedHandler={isClosedHandler}
            type={true}
            friends={friend}
          />
        ) : (
          forward && (
            <FriendList isClosedHandler={isClosedHandler} friends={friend} />
          )
        )}

        <NavBarContact />

        <Routes>
          <Route path={`/*`} element={<ChatContact header="Chats" />}></Route>
          <Route
            path={`/friends/*`}
            element={<ChatContact header="Friends" />}
          ></Route>
          <Route
            path={`/calls/*`}
            element={<ChatContact header="Calls" />}
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

          <Notification error={error} closeNotification={closeNotification} />
        </ChatBodyContainer>
      </MainLayOut>
    </Container>
  );
};

export default ChatRoom;
