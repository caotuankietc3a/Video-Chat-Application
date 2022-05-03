import React, { useRef, useState, useEffect } from "react";
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
import { formatDate } from "../../../store/actions/common-function";

const Message = (props) => {
  const { type } = props;
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
      {<MessageDivider data-label="Yesterday"></MessageDivider>}
      <MessageContent type={type}>
        <MessageWrapper type={type}>
          <div>
            <span>{props.text}</span>
          </div>
        </MessageWrapper>
        <MessageOptions type={type}>
          <AvatarUser>
            <img src="/images/user-img.jpg" alt="" />
          </AvatarUser>
          <span>{formatDate(props.date)}</span>
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
