import { MainLayOut, Container, ChatBodyContainer } from "./StyledChatRoom";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ChatForm from "../ChatForm/ChatForm";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatContact from "./ChatContact/ChatContact";
import FriendForm from "../FriendForm/FriendForm";
import MeetingForm from "../MeetingForm/MeetingForm";
import { fetchUserLogin } from "../../store/actions/fetch-action";
import { conversationActions } from "../../store/slices/conversation-slice";
import { videoActions } from "../../store/slices/video-chat-slice";
import NavBarContact from "../NavBarContact/NavBarContact";
import User from "../User/User";

const ChatRoom = (props) => {
  console.log("ChatRoom running");
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const { friend } = useSelector((state) => state.friend);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket_chat, socket_video } = useSelector((state) => state.socket);

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
  }, []);

  return (
    <Container>
      <MainLayOut>
        <NavBarContact />

        <Routes>
          <Route path={`/*`} element={<ChatContact header="Chats" />}></Route>
          <Route
            path={`/friends/*`}
            element={<ChatContact header="Friends" />}
          ></Route>
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

            <Route path={`/`} element={<User user={user} />}></Route>
          </Routes>
        </ChatBodyContainer>
      </MainLayOut>
    </Container>
  );
};

export default ChatRoom;
