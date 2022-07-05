import React from "react";
import { AvatarUser } from "../../ChatRoom/ChatContact/StyledContacts";
import {
  ChatHeader,
  ChatHeaderAvatar,
  Media,
  UlChatHeaderOptions,
} from "./StyledHeader";
import { LiTag } from "../../NavBarContact/StyledNavBarContact";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsTelephone, BsSearch } from "react-icons/bs";

const Header = ({ conversation, onClickVideoCall, toggleShowSearchBox }) => {
  return (
    <ChatHeader>
      <ChatHeaderAvatar className="text-truncate">
        <AvatarUser status={conversation.status ? true : false}>
          <img src={`${conversation.profilePhoto}`} alt="" />
        </AvatarUser>
        <Media>
          <h6 className="text-truncate">{conversation.name}</h6>
          <small>
            {conversation.no_mems
              ? `${conversation.no_mems} participants`
              : conversation.status
              ? "Online"
              : "Offline"}
          </small>
        </Media>
      </ChatHeaderAvatar>
      <UlChatHeaderOptions>
        <a href="#" onClick={toggleShowSearchBox}>
          <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
            <BsSearch />
          </LiTag>
        </a>
        <a href="#" onClick={onClickVideoCall}>
          <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
            <BsTelephone />
          </LiTag>
        </a>
        <a href="#">
          <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
            <BiDotsVerticalRounded />
          </LiTag>
        </a>
      </UlChatHeaderOptions>
    </ChatHeader>
  );
};

export default Header;
