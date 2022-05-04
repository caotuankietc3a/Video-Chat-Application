import { useEffect } from "react";
import {
  ContactItems,
  AvatarUser,
  ContactContents,
  ContactInfo,
  ContactTexts,
} from "./StyledContacts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { conversationActions } from "../../../store/slices/conversation-slice";
import { friendActions } from "../../../store/slices/friend-slice";
import { BsPinMapFill } from "react-icons/bs";
import { formatDate } from "../../../store/actions/common-function";
const ChatContactItems = (props) => {
  const dispatch = useDispatch();
  const { conversation, friend, type } = props;
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const linkTo = props.type !== "Friends" ? `conversation` : "friend";
  const userState = useSelector((state) => state.user);
  const clickHandler = async () => {
    try {
      if (props.type !== "Friends") {
        const res = await fetch(
          `${END_POINT_SERVER}/conversation/detail/` + props.id
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
      } else {
        const res = await fetch(
          `${END_POINT_SERVER}/friend/detail/` + props.id
        );
        const friend = await res.json();
        dispatch(friendActions.setFriends({ friend: friend }));
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <ContactItems onClick={clickHandler}>
      {props.displayChar && <p>{friend.fullname[0].toUpperCase()}</p>}
      <Link to={linkTo + `/detail/${props.id}`}>
        <AvatarUser type={props.type}>
          <img
            src={
              type === "Friends"
                ? friend.profilePhoto
                : conversation.profilePhoto
            }
            alt=""
          />
        </AvatarUser>
        <ContactContents>
          <ContactInfo>
            <h6 className="text-truncate">
              {type === "Friends" ? friend.fullname : conversation.name}
            </h6>
            {type !== "Friends" && (
              <div>
                {conversation.messages.length - 1 !== -1
                  ? formatDate(
                      conversation.messages[conversation.messages.length - 1]
                        .date
                    )
                  : formatDate(new Date(Date.now()))}
              </div>
            )}
          </ContactInfo>
          <ContactTexts>
            {type === "Friends" && <BsPinMapFill />}
            <p className="text-truncate">
              {type === "Friends"
                ? friend.address
                : conversation.messages.length - 1 !== -1
                ? conversation.messages[conversation.messages.length - 1].text
                : "......."}
            </p>
          </ContactTexts>
        </ContactContents>
      </Link>
    </ContactItems>
  );
};

export default ChatContactItems;
