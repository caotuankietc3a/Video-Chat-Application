import { useEffect } from "react";
import {
  ContactItems,
  AvatarUser,
  ContactContents,
  ContactInfo,
  ContactTexts,
  ContactBtn,
} from "./StyledContacts";
import { BsTelephone } from "react-icons/bs";

import { HiPhoneIncoming, HiPhoneOutgoing } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { conversationActions } from "../../../store/slices/conversation-slice";
import { friendActions } from "../../../store/slices/friend-slice";
import { BsPinMapFill } from "react-icons/bs";
import {
  callComparedDate,
  formatDate,
} from "../../../store/actions/common-function";
import { callActions } from "../../../store/slices/call-slice";
const ChatContactItems = ({
  conversation,
  friend,
  meeting,
  type,
  id,
  displayChar = null,
  fullname,
}) => {
  const dispatch = useDispatch();
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const linkTo =
    type !== "Friends"
      ? type === "Calls"
        ? "call"
        : "conversation"
      : "friend";
  const userState = useSelector((state) => state.user);
  const clickHandler = async () => {
    try {
      if (type === "Chats") {
        const res = await fetch(
          `${END_POINT_SERVER}/conversation/detail/` + id
        );
        const conversation = await res.json();
        if (conversation.members.length === 2) {
          const member = conversation.members.find(
            (member) => member._id !== userState.user._id
          );
          dispatch(
            conversationActions.setConversation({
              conversation: {
                _id: conversation._id,
                members: conversation.members,
                name: member.fullname,
              },
            })
          );
        }
      } else if (type === "Friends") {
        const res = await fetch(`${END_POINT_SERVER}/friend/detail/` + id);
        const friend = await res.json();
        dispatch(friendActions.setFriends({ friend: friend }));
      } else if (type === "Calls") {
        const res = await fetch(
          `${END_POINT_SERVER}/meeting/detail/${id}?userId=${userState.user._id}`
        );
        const { calls_detail, callee } = await res.json();
        dispatch(callActions.setCalls({ calls: calls_detail }));
        dispatch(
          callActions.setMeeting({ meeting: { meetingId: id, callee } })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <ContactItems onClick={clickHandler}>
      {displayChar && <p>{friend.fullname[0].toUpperCase()}</p>}
      <Link to={linkTo + `/detail/${id}`}>
        <AvatarUser type={type}>
          <img
            src={
              type === "Friends"
                ? friend.profilePhoto
                : type === "Calls"
                ? meeting.callee.profilePhoto
                : conversation.profilePhoto
            }
            alt="User"
          />
        </AvatarUser>
        <ContactContents>
          <ContactInfo>
            <h6 className="text-truncate">
              {type === "Friends" && friend.fullname}
              {type === "Calls" && fullname}
              {type === "Chats" && conversation.name}
            </h6>
            {type === "Friends" && (
              <div>{formatDate(new Date(Date.now()))}</div>
            )}

            {type === "Chats" && (
              <div>
                {conversation.messages.length - 1 !== -1 &&
                  formatDate(
                    conversation.messages[conversation.messages.length - 1].date
                  )}
              </div>
            )}
          </ContactInfo>
          <ContactTexts>
            {type === "Friends" && <BsPinMapFill />}
            <p className="text-truncate">
              {type === "Friends" ? (
                friend.address
              ) : type === "Calls" ? (
                <span>
                  <HiPhoneIncoming />
                  {callComparedDate(meeting.date)}
                </span>
              ) : type === "Chats" &&
                conversation.messages.length - 1 !== -1 ? (
                conversation.messages[conversation.messages.length - 1].text
              ) : (
                "............"
              )}
            </p>
          </ContactTexts>
        </ContactContents>
        {type === "Calls" && (
          <ContactBtn>
            <BsTelephone />
          </ContactBtn>
        )}
      </Link>
    </ContactItems>
  );
};

export default ChatContactItems;
