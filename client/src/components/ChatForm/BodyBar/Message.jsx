import React, { useState, useEffect } from "react";
import { AvatarUser } from "../../ChatRoom/ChatContact/StyledContacts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  MessageContainer,
  MessageDivider,
  MessageContent,
  ReplyHeader,
  ReplyWrapper,
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
import { RiDeleteBinLine, RiReplyFill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { replyActions } from "../../../store/slices/reply-slice";

const Message = ({
  type,
  date,
  text,
  mesDivider: { divider, data_label },
  reply,
}) => {
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const { socket_chat } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  console.log(reply);
  const menuShowHandler = (e) => {
    setShowMenu(true);
  };
  const deleteMessageHandler = () => {
    socket_chat.emit("delete-message", {
      conversationId: conversation._id,
      text,
    });
  };
  const replyMessageHandler = () => {
    dispatch(
      replyActions.setReply({
        reply: {
          text,
          fullname: type === "right" ? user.fullname : conversation.name,
        },
      })
    );
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
        {reply && (
          <>
            <ReplyHeader type={type}>
              <div>
                <RiReplyFill />
              </div>
              {/* Need to fix */}
              <div className="text">You replied to {reply.fullname}</div>
            </ReplyHeader>
            <ReplyWrapper type={type}>
              <div className="reply-wrapper">
                <span>{reply.text}</span>
              </div>
            </ReplyWrapper>
          </>
        )}

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

                <DropDownItem onClick={replyMessageHandler}>
                  <IoReturnUpForward />
                  <span>Reply</span>
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
