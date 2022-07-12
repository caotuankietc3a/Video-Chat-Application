import React, { useState, useEffect } from "react";
import { AvatarUser } from "../../ChatRoom/ChatContact/StyledContacts";
import {
  ChatHeader,
  ChatHeaderAvatar,
  Media,
  UlChatHeaderOptions,
  DropDownItem,
  DropDownMenu,
} from "./StyledHeader";
import { LiTag } from "../../NavBarContact/StyledNavBarContact";
import { BiBlock, BiDotsVerticalRounded } from "react-icons/bi";
import { BsTelephone, BsSearch, BsInfoCircle, BsArchive } from "react-icons/bs";

import { RiDeleteBinLine } from "react-icons/ri";
import { VscMute } from "react-icons/vsc";
import { MdOutlineWallpaper } from "react-icons/md";
import { showMenuHandler } from "../../../store/actions/common-function";

const Header = ({
  conversation,
  onClickVideoCall,
  toggleShowSearchBox,
  toggleCloseChatInfo,
  deleteConversation,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuShowHandler = (e) => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    showMenuHandler(() => {
      setShowMenu(false);
    }, showMenu);
  }, [showMenu]);
  return (
    <ChatHeader>
      <ChatHeaderAvatar className="text-truncate">
        <AvatarUser status={conversation.status ? true : false}>
          <img src={`${conversation.profilePhoto.url}`} alt="" />
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
      <UlChatHeaderOptions
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
        <a href="#" onClick={menuShowHandler}>
          <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
            <BiDotsVerticalRounded />
          </LiTag>

          {showMenu && (
            <DropDownMenu>
              <DropDownItem onClick={toggleShowSearchBox}>
                <BsSearch />
                <span>Search</span>
              </DropDownItem>

              <DropDownItem onClick={toggleCloseChatInfo}>
                <BsInfoCircle />
                <span>View Info</span>
              </DropDownItem>

              <DropDownItem>
                <VscMute />
                <span>Mute Notifications</span>
              </DropDownItem>

              <DropDownItem>
                <MdOutlineWallpaper />
                <span>Wallpaper</span>
              </DropDownItem>

              <DropDownItem>
                <BsArchive />
                <span>Archive</span>
              </DropDownItem>

              <DropDownItem onClick={deleteConversation}>
                <RiDeleteBinLine />
                <span>Delete</span>
              </DropDownItem>

              <DropDownItem>
                <BiBlock />
                <span>Block</span>
              </DropDownItem>
            </DropDownMenu>
          )}
        </a>
      </UlChatHeaderOptions>
    </ChatHeader>
  );
};

export default Header;
