import React, { useState, useEffect } from "react";
import { AvatarUser } from "../../ChatRoom/ChatContact/StyledContacts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  MessageContainer,
  MessageDivider,
  MessageContent,
  Header,
  Wrapper,
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
import {
  RiDeleteBinLine,
  RiReplyFill,
  RiShareForwardFill,
} from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { replyActions } from "../../../store/slices/reply-slice";
import { forwardActions } from "../../../store/slices/forward-slice";

const Message = ({
  type,
  date,
  text,
  mesDivider: { divider, data_label },
  reply,
  forward,
}) => {
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const { socket_chat } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
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
  const replyMessageHandler = () => {
    dispatch(
      replyActions.setReply({
        reply: {
          text,
          replyee: type === "right" ? user.fullname : conversation.name,
          replyer: user.fullname,
        },
      })
    );
  };

  const forwardMessageHandler = () => {
    dispatch(
      forwardActions.setForward({
        forward: {
          text,
          forwarder: user,
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
            <Header type={type}>
              <div>
                <RiReplyFill />
              </div>
              <div className="text">
                {type === "right" ? "You" : reply.replyer} replied to{" "}
                {type === "right"
                  ? reply.replyee === user.fullname
                    ? "yourself"
                    : reply.replyee
                  : reply.replyee === user.fullname
                  ? "you"
                  : "themseft"}
              </div>
            </Header>
            <Wrapper type={type}>
              <div className="reply-wrapper">
                <span>{reply.text}</span>
              </div>
            </Wrapper>
          </>
        )}
        {forward && (
          <>
            <Header type={type} isForwarded={forward ? true : false}>
              <div>
                <RiShareForwardFill />
              </div>
              <div className="text">
                {type === "right" ? "You" : forward.forwarder.fullname}{" "}
                forwarded a message
              </div>
            </Header>
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

                <DropDownItem onClick={forwardMessageHandler}>
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
