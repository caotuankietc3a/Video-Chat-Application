import { useState, useRef, useEffect } from "react";
import { ContactLists } from "./StyledContacts";
import ChatContactItems from "./ChatContactItems";
import { useSelector, useDispatch } from "react-redux";
import { userLoginActions } from "../../../store/slices/user-login-slice";
import { compareString } from "../../../store/actions/common-function";
import SkeletonConatactItems from "../../UI/SkeletonLoading/SkeletonConatactItems";
import { callActions } from "../../../store/slices/call-slice";

const ChatContactLists = ({ searchContactItems, type }) => {
  const [conversations, setConversations] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const [friends, setFriends] = useState([]);
  // const [isActive, setIsActive] = useState(false);
  const [calls, setCalls] = useState([]);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const contactList = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch(`${END_POINT_SERVER}/auth/session`, {
          credentials: "include",
        });
        const res = await data.json();
        if (res.isLogin) {
          dispatch(
            userLoginActions.setUserLogin({
              user: res.user,
              isFetching: true,
              error: null,
            })
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resConversation = await fetch(
          `${END_POINT_SERVER}/conversation/${
            userState.user ? userState.user._id : "error"
          }`,
          {
            credentials: "include",
          }
        );
        const conversations = await resConversation.json();
        setConversations(conversations);

        const resFriends = await fetch(
          `${END_POINT_SERVER}/friend/${
            userState.user ? userState.user._id : "error"
          }`,
          {
            credentials: "include",
          }
        );

        const friends = await resFriends.json();
        setFriends(compareString(friends));
        setTimeout(() => {
          setIsFetching(false);
        }, 1250);
        // setIsFetching(true);
      } catch (err) {
        console.error(err);
      }
    };
    getConversation();
  }, [window.location.href, isFetching]);

  useEffect(() => {
    (async () => {
      try {
        if (userState.user?._id) {
          const data = await fetch(
            `${END_POINT_SERVER}/meeting?userId=${userState.user._id}`,
            {
              credentials: "include",
            }
          );
          const res = await data.json();
          console.log(res);
          setCalls(res);
          // dispatch(callActions.setMeeting())
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userState.user]);

  useEffect(() => {
    const AddBgEl = (e) => {
      e.classList.add("active");
    };
    const RemoveBgEl = (els) => {
      els.forEach((el) => {
        el.classList.remove("active");
      });
    };
    contactList.current.querySelectorAll("li a").forEach((el) => {
      el.addEventListener("click", () => {
        RemoveBgEl(contactList.current.querySelectorAll("li a"));
        AddBgEl(el);
      });
    });
  }, [contactList, window.location.href]);

  const filterConversationsHandler = (conversations, searchContactItems) => {
    return conversations
      .filter((conversation) => {
        if (searchContactItems === "") return true;
        const member = conversation?.members.find(
          (member) => member._id !== userState.user._id
        );
        if (
          member.fullname
            .toLowerCase()
            .includes(searchContactItems.toLowerCase())
        )
          return true;
        return false;
      })
      .map((conversation, i) => {
        const member = conversation?.members.find(
          (member) => member._id.toString() !== userState.user._id.toString()
        );
        conversation.name = member.fullname;
        return (
          <ChatContactItems
            key={i}
            id={conversation._id}
            conversation={conversation}
            type={type}
          />
        );
      });
  };

  const filterFriendsHandler = (friends, searchContactItems) => {
    return friends
      ?.filter((friend) => {
        if (searchContactItems === "") return true;
        if (
          friend.fullname
            .toLowerCase()
            .includes(searchContactItems.toLowerCase())
        )
          return true;
        return false;
      })
      .map((friend, i) => {
        let character = false;
        if (
          i === 0 ||
          friend.fullname[0].toLowerCase() !==
            friends[i - 1].fullname[0].toLowerCase()
        )
          character = true;
        return (
          <ChatContactItems
            key={i}
            id={friend._id}
            friend={friend}
            type={type}
            displayChar={character}
          />
        );
      });
  };

  const filterCallsHandler = (meetings, searchContactItems) => {
    return meetings
      ?.filter((meeting, _i) => {
        if (searchContactItems === "") return true;
        if (
          meeting.callee.fullname
            .toLowerCase()
            .includes(searchContactItems.toLowerCase())
        )
          return true;
        return false;
      })
      .map((meeting, i) => {
        const fullname =
          meeting.callee._id.toString() === userState.user._id.toString()
            ? meeting.caller.fullname
            : meeting.callee.fullname;
        return (
          <ChatContactItems
            key={i}
            type={type}
            meeting={meeting}
            fullname={fullname}
            id={meeting._id}
          />
        );
      });
  };

  return (
    <ContactLists ref={contactList}>
      {isFetching ? (
        <>
          {Array(8)
            .fill(undefined)
            .map((_el, i) => (
              <SkeletonConatactItems key={i} />
            ))}
        </>
      ) : (
        <>
          {type === "Chats" &&
            filterConversationsHandler(conversations, searchContactItems)}
          {type === "Friends" &&
            filterFriendsHandler(friends, searchContactItems)}
          {type === "Calls" && filterCallsHandler(calls, searchContactItems)}
        </>
      )}
    </ContactLists>
  );
};
export default ChatContactLists;
