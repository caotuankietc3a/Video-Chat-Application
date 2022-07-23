import { MainLayOut, Container, ChatBodyContainer } from "./StyledChatRoom";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ChatForm from "../ChatForm/ChatForm";
import { useSelector, useDispatch } from "react-redux";
import ChatContact from "./ChatContact/ChatContact";
import FriendForm from "../FriendForm/FriendForm";
import CallForm from "../CallForm/CallForm";
import MeetingForm from "../MeetingForm/MeetingForm";
import {
  fetchChatContacts,
  fetchFriends,
  fetchUserLogin,
} from "../../store/actions/fetch-action";
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
import { compareString } from "../../store/actions/common-function";
const ChatRoom = () => {
  console.log("ChatRoom running");
  const { conversation } = useSelector((state) => state.conversation);
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const [conversations, setConversations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [calls, setCalls] = useState([]);
  // const [rendering, setRendering] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useSelector((state) => state.user);
  const friendState = useSelector((state) => state.friend);
  const { error } = useSelector((state) => state.error);
  const { forward } = useSelector((state) => state.forward);
  const callState = useSelector((state) => state.call);
  const { friend } = useSelector((state) => state.friend);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isClickedConversation, setIsClickedConversation] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const [invite, setInvite] = useState(false);
  const { socket_chat, socket_video, socket_notify } = useSelector(
    (state) => state.socket
  );
  const fetchConversations = () => {
    dispatch(
      fetchChatContacts(
        {
          url: `${END_POINT_SERVER}/conversation/${user ? user._id : "error"}`,
        },
        (data) => {
          setConversations(data);
        }
      )
    );
  };

  useEffect(() => {
    socket_notify.on("log-out", () => {
      fetchConversations();
      dispatch(conversationActions.setStatus({ status: false }));
    });

    socket_notify.on("log-in", () => {
      fetchConversations();
      dispatch(conversationActions.setStatus({ status: true }));
    });

    socket_notify.on("post-new-group-conversation", () => {
      dispatch(fetchFriends());
      fetchConversations();
    });

    socket_notify.on("post-new-conversation", () => {
      fetchConversations();
    });

    socket_notify.on("delete-conversation", () => {
      fetchConversations();
    });

    socket_notify.on("block-conversation", () => {
      fetchConversations();
    });

    socket_notify.on("send-message", () => {
      fetchConversations();
    });

    socket_notify.on("forward-message", () => {
      fetchConversations();
    });

    return () => {
      socket_notify.off("log-out");
      socket_notify.off("log-in");
      socket_notify.off("post-new-conversation");
      socket_notify.off("post-new-group-conversation");
      socket_notify.off("delete-conversation");
      socket_notify.off("block-conversation");
      socket_notify.off("send-message");
      socket_notify.off("forward-message");
    };
  }, [user]);

  const isClickedHandler = () => {
    setIsClickedConversation(true);
  };

  const createGroupHandler = () => {
    setCreateGroup(true);
  };

  const inviteHandler = () => {
    setInvite(true);
  };

  const isClosedHandler = () => {
    setIsClickedConversation(false);
    setCreateGroup(false);
    setInvite(false);
    dispatch(forwardActions.setForward({ forward: null }));
  };

  useEffect(() => {
    dispatch(fetchUserLogin(navigate, 1));
  }, []);

  useEffect(() => {
    dispatch(
      fetchChatContacts(
        {
          url: `${END_POINT_SERVER}/conversation/${user ? user._id : "error"}`,
        },
        (data) => {
          setConversations(data);
        }
      )
    );

    dispatch(
      fetchChatContacts(
        {
          url: `${END_POINT_SERVER}/friend/${user ? user._id : "error"}`,
        },
        (data) => {
          setFriends(compareString(data));
        }
      )
    );
    setIsFetching(false);
  }, []);

  useEffect(() => {
    if (user?._id) {
      dispatch(
        fetchChatContacts(
          {
            url: `${END_POINT_SERVER}/meeting?userId=${user._id}`,
          },
          (data) => {
            setCalls(data);
          }
        )
      );
      setIsFetching(false);
    }
  }, [user]);

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

        navigate(`/home-chat/meetings/${conversationId}`);
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
    socket_video.on(
      "make-group-connection-call",
      ({ conversationId, conversation, callerId }) => {
        const member = conversation.members.find(
          (mem) => mem.user._id === user._id
        );
        if (!member.block.isBlocked) {
          dispatch(
            conversationActions.setConversation({
              conversation: {
                _id: conversation._id,
                members: conversation.members,
                name: conversation.name,
                profilePhoto: conversation.profilePhoto.url,
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
                  groupImg: conversation.profilePhoto.url,
                },
              },
            })
          );

          navigate(`/home-chat/meetings/${conversationId}`);
        }
      }
    );

    return () => {
      socket_video.off("make-group-connection-call");
    };
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(fetchFriends());
    }
  }, [user]);

  return (
    <Container>
      <MainLayOut>
        {(isClickedConversation || forward || createGroup || invite) && (
          <Portal>
            <FriendList
              isClosedHandler={isClosedHandler}
              friends={
                forward || isClickedConversation ? friendState.friends : friends
              }
              createGroup={createGroup}
              invite={invite}
              user={user}
              forward={forward}
            />
          </Portal>
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
                inviteHandler={inviteHandler}
                conversations={conversations}
                isFetching={isFetching}
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
                friends={friends}
                isFetching={isFetching}
              />
            }
          ></Route>
          <Route
            path={`/calls/*`}
            element={
              <ChatContact
                header="Calls"
                isClickedHandler={isClickedHandler}
                createGroupHandler={createGroupHandler}
                isFetching={isFetching}
                calls={calls}
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
                  socket_notify={socket_notify}
                  // toggleBlockHandler={toggleBlockHandler}
                  // blockHandler={blockHandler}
                  // block={block}
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
