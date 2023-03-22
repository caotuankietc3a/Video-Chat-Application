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
import { BsPinMapFill } from "react-icons/bs";
import {
  callComparedDate,
  formatDate,
} from "../../../store/actions/common-function";
import { fetchDetailConversation } from "../../../store/actions/conversation-function";
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
  const [isActive, setIsActive] = useState(false);

  let length = null;
  let latestMessage = null;
  let profilePhoto = null;

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
        dispatch(fetchDetailConversation({ id, userId: userState.user._id }));
      }
      setIsActive(true);
    } catch (err) {
      console.error(err);
      setIsActive(false);
    }
  };
  const getCallsImg = (meeting) => {
    let username = userState.user.fullname;
    if (username === meeting.callee.fullname)
      return meeting.caller.profilePhoto.url;
    return meeting.callee.profilePhoto.url;
  };

  return (
    <ContactItems onClick={clickHandler}>
      {displayChar && <p>{friend.fullname[0].toUpperCase()}</p>}
      <Link to={linkTo + `/detail/${id}?userId=${userState.user._id}`}>
        <AvatarUser type={type} status={status}>
          <img
            src={
              type === "Friends"
                ? friend.profilePhoto.url
                : type === "Calls"
                  ? getCallsImg(meeting)
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
                      className={`${!meeting.callAccepted ? "missed-call" : "inactive"
                        }`}
                    />
                  ) : (
                    <HiPhoneIncoming
                      className={`${!meeting.callAccepted ? "missed-call" : "inactive"
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
