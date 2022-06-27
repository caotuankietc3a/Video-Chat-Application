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
import { AiOutlineStar, AiOutlineFileText } from "react-icons/ai";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import {
  RiDeleteBinLine,
  RiReplyFill,
  RiShareForwardFill,
} from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { replyActions } from "../../../store/slices/reply-slice";
import { forwardActions } from "../../../store/slices/forward-slice";
import { messageActions } from "../../../store/slices/message-slice";
import { showMenuHandler } from "../../../store/actions/common-function";

const Message = ({
  type,
  date,
  text,
  mesDivider: { divider, data_label },
  reply,
  forward,
  sender,
  isGroup,
  images,
  attachments,
}) => {
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const { socket_chat } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const menuShowHandler = (e) => {
    setShowMenu(!showMenu);
  };
  const deleteMessageHandler = () => {
    setShowMenu(false);
    socket_chat.emit("delete-message", {
      conversationId: conversation._id,
      text,
    });
    dispatch(messageActions.setReRender({ reRender: { text } }));
  };
  const replyMessageHandler = () => {
    setShowMenu(false);
    dispatch(
      replyActions.setReply({
        reply: {
          text,
          replyee: isGroup
            ? sender.fullname
            : type === "right"
            ? user.fullname
            : conversation.name,
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

    setShowMenu(false);
  };
  useEffect(() => {
    showMenuHandler(() => {
      setShowMenu(false);
    }, showMenu);
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
                {isGroup
                  ? type === "right"
                    ? reply.replyee === user.fullname
                      ? "yourself"
                      : reply.replyee
                    : reply.replyee === user.fullname
                    ? "you"
                    : reply.replyee === reply.replyer
                    ? "themseft"
                    : reply.replyee
                  : type === "right"
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
          <div className="text">
            {isGroup && type === "left" && <h6>{sender.fullname}</h6>}
            {text !== "" && <span>{text}</span>}
            {images.length !== 0 && (
              <div className="images-row">
                {images.map((img, i) => (
                  <div className="image-row" key={i}>
                    <div className="item">
                      <img src={img} alt="Image" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {attachments.length !== 0 &&
            attachments.map((attachment) => (
              <div className="attachments">
                <div className="attachments-btn">
                  <HiOutlineDocumentDuplicate />
                </div>
                <div className="attachments-body">
                  <h6>
                    <a href=" #">global-warming-data-2020.xlsx wf</a>
                  </h6>
                  <div className="payload-file">79.2Kb</div>
                </div>
              </div>
            ))}
        </MessageWrapper>
        <MessageOptions type={type}>
          <AvatarUser>
            <img src="/images/user-img.jpg" alt="" />
          </AvatarUser>
          <span>{date}</span>
          <MessageOptionsDropDown
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <BiDotsHorizontalRounded onClick={menuShowHandler} />
            {showMenu && (
              <DropDownMenu
                onClick={() => {
                  setShowMenu(false);
                }}
              >
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
