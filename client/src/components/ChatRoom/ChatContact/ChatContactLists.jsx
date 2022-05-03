import { ContactLists } from "./StyledContacts";
import ChatContactItems from "./ChatContactItems";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userLoginActions } from "../../../store/slices/user-login-slice";
import { compareString } from "../../../store/actions/common-function";

const ChatContactLists = (props) => {
  const [conversations, setConversations] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { searchContactItems } = props;

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch("http://localhost:5000/auth/session", {
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
          `http://localhost:5000/conversation/${
            userState.user ? userState.user._id : "error"
          }`,
          {
            credentials: "include",
          }
        );
        const conversations = await resConversation.json();
        setConversations(conversations);

        const resFriends = await fetch(
          `http://localhost:5000/friend/${
            userState.user ? userState.user._id : "error"
          }`,
          {
            credentials: "include",
          }
        );

        const friends = await resFriends.json();
        setFriends(compareString(friends));
        setIsFetching(true);
      } catch (err) {
        console.error(err);
      }
    };
    getConversation();
  }, [window.location.href, isFetching]);

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
      })
      .map((conversation, i) => {
        const member = conversation?.members.find(
          (member) => member._id !== userState.user._id
        );
        conversation.name = member.fullname;
        return (
          <ChatContactItems
            key={i}
            id={conversation._id}
            conversation={conversation}
            type={props.type}
          ></ChatContactItems>
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
            type={props.type}
            displayChar={character}
          ></ChatContactItems>
        );
      });
  };

  return (
    <ContactLists>
      {props.type !== "Friends" &&
        filterConversationsHandler(conversations, searchContactItems)}
      {props.type === "Friends" &&
        filterFriendsHandler(friends, searchContactItems)}
    </ContactLists>
  );
};
export default ChatContactLists;