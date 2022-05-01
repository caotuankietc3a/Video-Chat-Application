import {
  MainLayOut,
  Container,
  NavBar,
  UlNav,
  LiTag,
  ChatBodyContainer,
} from "./StyledChatRoom";
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ChatForm from "../ChatForm/ChatForm";
import { RiMessengerLine } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BiUserCircle } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatContact from "./ChatContact/ChatContact";
import FriendForm from "../FriendForm/FriendForm";
import MeetingForm from "../MeetingForm/MeetingForm";
import { fetchUserLogin } from "../../store/fetch-action";
import { conversationActions } from "../../store/conversation-slice";
import { videoActions } from "../../store/video-chat-slice";

const ChatRoom = (props) => {
  console.log("CharRoom running");
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
        <NavBar>
          <a href="">
            <RiMessengerLine />
          </a>
          <UlNav>
            <Link to="/home-chat/" className="active">
              <LiTag ptd="24px" plr="0px" w="1.5rem" h="1.5rem">
                <TiMessages />
              </LiTag>
            </Link>
            <Link to="">
              <LiTag ptd="24px" plr="0px" w="1.5rem" h="1.5rem">
                <BsTelephone />
              </LiTag>
            </Link>
            <Link to="/home-chat/friends">
              <LiTag ptd="24px" plr="0px" w="1.5rem" h="1.5rem">
                <HiOutlineUsers />
              </LiTag>
            </Link>
            <Link to="">
              <LiTag ptd="24px" plr="0px" w="1.5rem" h="1.5rem">
                <BiUserCircle />
              </LiTag>
            </Link>
          </UlNav>
        </NavBar>

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
          </Routes>
        </ChatBodyContainer>
      </MainLayOut>
    </Container>
  );
};

export default ChatRoom;
