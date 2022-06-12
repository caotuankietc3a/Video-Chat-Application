import React, { useState, useEffect } from "react";
import { AvatarUser } from "../../ChatRoom/ChatContact/StyledContacts";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
import { useSelector } from "react-redux";

const Message = (props) => {
  const { conversation } = useSelector((state) => state.conversation);
  const { socket_chat } = useSelector((state) => state.socket);
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
  const deleteMessageHandler = () => {
    socket_chat.emit("delete-message", {
      conversationId: conversation._id,
      text,
    });
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
                <CopyToClipboard text={text}>
                  <DropDownItem>
                    <IoCopyOutline />
                    <span>Copy</span>
                  </DropDownItem>
                </CopyToClipboard>

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
                <DropDownItem onClick={deleteMessageHandler}>
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
