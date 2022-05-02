import React from "react";
import { AvatarUser } from "../../ChatRoom/ChatContact/StyledContacts";
import {
  ChatHeader,
  ChatHeaderAvatar,
  Media,
  UlChatHeaderOptions,
} from "./StyledHeader";
import { LiTag } from "../../ChatRoom/StyledChatRoom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsTelephone, BsSearch } from "react-icons/bs";

const Header = (props) => {
  const { conversation } = props;
  return (
    <ChatHeader>
      <ChatHeaderAvatar className="text-truncate">
        <AvatarUser>
          <img src="/images/user-img.jpg" alt="" />
        </AvatarUser>
        <Media>
          <h6 className="text-truncate">{conversation.name}</h6>
          <small>Just now</small>
        </Media>
      </ChatHeaderAvatar>
      <UlChatHeaderOptions>
        <a href="">
          <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
            <BsSearch />
          </LiTag>
        </a>
        <a href="" onClick={props.onClickVideoCall}>
          <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
            <BsTelephone />
          </LiTag>
        </a>
        <a href="">
          <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
            <BiDotsVerticalRounded />
          </LiTag>
        </a>
      </UlChatHeaderOptions>
    </ChatHeader>
  );
};

export default Header;
