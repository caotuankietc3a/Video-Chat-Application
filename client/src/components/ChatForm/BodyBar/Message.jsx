import React, { useState, useEffect } from "react";
import { AvatarUser } from "../../ChatRoom/ChatContact/StyledContacts";
import {
  MessageContainer,
  MessageDivider,
  MessageContent,
  MessageWrapper,
  MessageOptions,
  MessageOptionsDropDown,
  DropDownMenu,
  DropDownItem,
} from "./StyledMessage";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  IoCopyOutline,
  IoReturnUpForward,
  IoReturnUpBack,
} from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";

const Message = (props) => {
  const {
    type,
    date,
    text,
    mesDivider: { divider, data_label },
  } = props;
  const [showMenu, setShowMenu] = useState(false);
  const menuShowHandler = (e) => {
    setShowMenu(true);
  };
  useEffect(() => {
    const checkIsClickOutside = (e) => {
      if (showMenu) setShowMenu(false);
    };
    document.addEventListener("click", checkIsClickOutside);
    return () => {
      document.removeEventListener("click", checkIsClickOutside);
    };
  }, [showMenu]);
  return (
    <MessageContainer type={type}>
      {divider && <MessageDivider data-label={data_label}></MessageDivider>}
      <MessageContent type={type}>
        <MessageWrapper type={type}>
          <div>
            <span>{text}</span>
          </div>
        </MessageWrapper>
        <MessageOptions type={type}>
          <AvatarUser>
            <img src="/images/user-img.jpg" alt="" />
          </AvatarUser>
          <span>{date}</span>
          <MessageOptionsDropDown>
            <BiDotsHorizontalRounded onClick={menuShowHandler} />
            {showMenu && (
              <DropDownMenu>
                <DropDownItem>
                  <IoCopyOutline />
                  <span>Copy</span>
                </DropDownItem>

                <DropDownItem>
                  <IoReturnUpForward />
                  <span>Replay</span>
                </DropDownItem>

                <DropDownItem>
                  <IoReturnUpBack />
                  <span>Forward</span>
                </DropDownItem>
                <DropDownItem>
                  <AiOutlineStar />
                  <span>Favorite</span>
                </DropDownItem>
                <DropDownItem>
                  <RiDeleteBinLine />
                  <span>Delete</span>
                </DropDownItem>
              </DropDownMenu>
            )}
          </MessageOptionsDropDown>
        </MessageOptions>
      </MessageContent>
    </MessageContainer>
  );
};
export default Message;
