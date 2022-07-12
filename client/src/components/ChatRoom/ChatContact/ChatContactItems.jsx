import { useEffect, useState } from "react";
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
import { replyActions } from "../../../store/slices/reply-slice";
const ChatContactItems = ({
  conversation,
  friend,
  meeting,
  type,
  id,
  displayChar = null,
  fullname,
  status,
  isGroup = false,
}) => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const [isActive, setIsActive] = useState(false);

  let length;
  let latestMessage;
  let profilePhoto;

  if (type === "Chats") {
    length = conversation.messages.length;
    const member = conversation.members.find(
      (mem) => mem.user._id !== userState.user._id
    );
    profilePhoto = isGroup
      ? conversation.profilePhoto.url
      : member.user.profilePhoto.url;
    if (length - 1 !== -1) {
      latestMessage = {
        text: conversation.messages[length - 1].text,
        images: conversation.messages[length - 1].files.images,
        attachments: conversation.messages[length - 1].files.attachments,
      };
    }
  }
  const linkTo =
    type !== "Friends"
      ? type === "Calls"
        ? "call"
        : "conversation"
      : "friend";

  const clickHandler = async () => {
    try {
      if (type === "Chats") {
        const res = await fetch(
          `${END_POINT_SERVER}/conversation/detail/` + id
        );
        const conversation = await res.json();

        if (conversation.members.length === 2) {
          const member = conversation.members.find(
            (member) => member.user._id !== userState.user._id
          );
          dispatch(
            conversationActions.setConversation({
              conversation: {
                _id: conversation._id,
                members: conversation.members,
                name: member.user.fullname,
                address: member.user.address,
                email: member.user.email,
                time: formatDate(new Date(Date.now())),
                profilePhoto: member.user.profilePhoto,
                status: member.user.status,
              },
            })
          );
        } else {
          dispatch(
            conversationActions.setConversation({
              conversation: {
                _id: conversation._id,
                members: conversation.members,
                name: conversation.name,
                time: formatDate(new Date(Date.now())),
                no_mems: conversation.members.length,
                profilePhoto: conversation.profilePhoto,
                status: true,
              },
            })
          );
        }
        dispatch(replyActions.setReply({ reply: null }));
      } else if (type === "Friends") {
        const res = await fetch(`${END_POINT_SERVER}/friend/detail/` + id);
        const friend = await res.json();
        dispatch(friendActions.setFriend({ friend: friend }));
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
      setIsActive(true);
    } catch (err) {
      console.error(err);
    }
  };
  console.log(type);
  console.log(isGroup);

  return (
    <ContactItems onClick={clickHandler}>
      {displayChar && <p>{friend.fullname[0].toUpperCase()}</p>}
      <Link to={linkTo + `/detail/${id}`}>
        <AvatarUser type={type} status={status}>
          <img
            src={
              type === "Friends"
                ? friend.profilePhoto.url
                : type === "Calls"
                ? meeting.callee.profilePhoto.url
                : isGroup
                ? conversation.profilePhoto.url
                : profilePhoto
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
            <p className="text-truncate">
              {type === "Friends" ? (
                <span className={isActive ? "active" : "inactive"}>
                  <BsPinMapFill />
                  {friend.address}
                </span>
              ) : type === "Calls" ? (
                <span className={isActive ? "active" : "inactive"}>
                  {userState.user._id.toString() ===
                  meeting.caller._id.toString() ? (
                    <HiPhoneOutgoing
                      className={`${
                        !meeting.callAccepted ? "missed-call" : "inactive"
                      }`}
                    />
                  ) : (
                    <HiPhoneIncoming
                      className={`${
                        !meeting.callAccepted ? "missed-call" : "inactive"
                      }`}
                    />
                  )}
                  {callComparedDate(meeting.date)}
                </span>
              ) : (
                type === "Chats" && (
                  <span className={isActive ? "active" : "inactive"}>
                    {isGroup &&
                      length - 1 !== -1 &&
                      conversation.messages[length - 1].sender.fullname + ": "}

                    {length - 1 !== -1
                      ? latestMessage.text === "" &&
                        latestMessage.images.length !== 0
                        ? isGroup
                          ? "sended some images!"
                          : "Some images are sended!"
                        : latestMessage.attachments.length !== 0
                        ? isGroup
                          ? "sended some files!"
                          : "Some files are sended!"
                        : latestMessage.text
                      : "............"}
                  </span>
                )
              )}
            </p>
          </ContactTexts>
        </ContactContents>
        {type === "Calls" && (
          <ContactBtn className={isActive ? "active" : ""}>
            <BsTelephone />
          </ContactBtn>
        )}
      </Link>
    </ContactItems>
  );
};

export default ChatContactItems;
