import { useState, useRef, useEffect } from "react";
import { ContactLists } from "./StyledContacts";
import ChatContactItems from "./ChatContactItems";
import { useSelector, useDispatch } from "react-redux";
// import { compareString } from "../../../store/actions/common-function";
import SkeletonConatactItems from "../../UI/SkeletonLoading/SkeletonConatactItems";
// import { conversationActions } from "../../../store/slices/conversation-slice";

const ChatContactLists = ({
  searchContactItems,
  type,
  conversations,
  friends,
  calls,
  isFetching,
}) => {
  console.log("ChatContactLists running!!!");
  const userState = useSelector((state) => state.user);
  const contactList = useRef(null);

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
  }, [contactList, window.location.href, conversations, friends, calls]);

  const filterConversationsHandler = (conversations, searchContactItems) => {
    return conversations
      .filter((conversation) => {
        if (searchContactItems === "") return true;
        if (
          conversation.members.length === 2 &&
          conversation.profilePhoto.cloudinary_id === "" &&
          conversation.profilePhoto.name === ""
        ) {
          const member = conversation?.members.find(
            (member) =>
              member.user._id.toString() !== userState.user._id.toString()
          );
          if (
            member.user.fullname
              .toLowerCase()
              .includes(searchContactItems.toLowerCase())
          )
            return true;
        } else {
          if (
            conversation.name
              .toLowerCase()
              .includes(searchContactItems.toLowerCase())
          )
            return true;
        }
        return false;
      })
      .map((conversation, i) => {
        if (
          conversation.members.length === 2 &&
          conversation.profilePhoto.cloudinary_id === "" &&
          conversation.profilePhoto.name === ""
        ) {
          const member = conversation?.members.find(
            (member) =>
              member.user._id.toString() !== userState.user._id.toString()
          );
          conversation.name = member?.user.fullname;
          return (
            <ChatContactItems
              key={i}
              id={conversation._id}
              conversation={conversation}
              type={type}
              status={member?.user.status}
            />
          );
        } else {
          return (
            <ChatContactItems
              key={i}
              id={conversation._id}
              conversation={conversation}
              type={type}
              status={true}
              isGroup={true}
            />
          );
        }
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
