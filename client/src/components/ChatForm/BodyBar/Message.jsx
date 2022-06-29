import React, { useState, useEffect, Fragment } from "react";
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
import { ImImages } from "react-icons/im";
import {
  RiDeleteBinLine,
  RiReplyFill,
  RiShareForwardFill,
  RiAttachment2,
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
  id,
}) => {
  const { conversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const { socket_chat } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const menuShowHandler = (e) => {
    setShowMenu(!showMenu);
  };
  const deleteMessageHandler = (id) => {
    setShowMenu(false);
    socket_chat.emit("delete-message", {
      conversationId: conversation._id,
      id,
    });
    dispatch(messageActions.setReRender({ reRender: { id } }));
  };

  const replyMessageHandler = () => {
    setShowMenu(false);
    dispatch(
      replyActions.setReply({
        reply: {
          messageId: id,
          text,
          replyee: isGroup
            ? sender.fullname
            : type === "right"
            ? user.fullname
            : conversation.name,
          replyer: user.fullname,
          haveImages: images.length === 0 ? false : true,
          haveAttachments: attachments.length === 0 ? false : true,
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
          images,
          attachments,
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
          <Fragment>
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
              <a href={`#${reply.messageId}`}>
                <div className="reply-wrapper">
                  <span>
                    {reply.text !== ""
                      ? reply.text
                      : reply.haveImages
                      ? "Images "
                      : reply.haveAttachments
                      ? "Attachments "
                      : "......."}
                  </span>
                  {reply.text === "" && reply.haveAttachments && (
                    <RiAttachment2 />
                  )}
                  {reply.text === "" && reply.haveImages && <ImImages />}
                </div>
              </a>
            </Wrapper>
          </Fragment>
        )}

        {forward && (
          <>
            <Header type={type} isForwarded={forward}>
              <div>
                <RiShareForwardFill />
              </div>
              <div className="text">
                {type === "right" ? "You" : sender.fullname} forwarded a message
              </div>
            </Header>
          </>
        )}

        <MessageWrapper type={type} id={id}>
          <div className="text">
            {isGroup && type === "left" && <h6>{sender.fullname}</h6>}
            {text !== "" && <span>{text}</span>}
            {images.length !== 0 && (
              <div className="images-row">
                {images.map(({ url, name }, i) => (
                  <div className="image-row" key={i}>
                    <div className="item">
                      <img src={url} alt="Image" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {attachments.length !== 0 &&
              attachments.map(({ name, size, url }, i) => (
                <div className="attachments" key={i}>
                  <div className="attachments-btn">
                    <HiOutlineDocumentDuplicate />
                  </div>
                  <div className="attachments-body">
                    <h6>
                      <a href={url}>{name}</a>
                    </h6>
                    <div className="payload-file">{`${size} Kb`}</div>
                  </div>
                </div>
              ))}
          </div>
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
                <DropDownItem
                  onClick={() => {
                    deleteMessageHandler(id);
                  }}
                >
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
