import React, { useRef, useEffect, useState, forwardRef } from "react";
import { RiMailSendLine } from "react-icons/ri";
import {
  ChatFooter,
  InputGroup,
  ReplyMessageContainer,
  ReplyMessageContent,
  ReplyMessageBtn,
  ReplyMessageInfo,
  ReplyMessageText,
  ReplyMessageHeader,
  FilesContainer,
  FilesContent,
  FilesBtn,
  Files,
  Attachments,
  AnotherFilesBtn,
  FilesInfo,
} from "./StyledInput";
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ImImages, ImAttachment } from "react-icons/im";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { AiFillFileText } from "react-icons/ai";
import { BsFiles } from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";
import { replyActions } from "../../../store/slices/reply-slice";
import EmojiPicker from "../../UI/EmojiPicker/EmojiPicker";
import { showMenuHandler } from "../../../store/actions/common-function";

const Input = ({
  clickHandler,
  imagesRef,
  attachmentsRef,
  multipleImagesHandler,
  multipleAttachmentsHandler,
  images,
  removeImageInBuffers,
  removeAttachmentInBuffers,
  attachments,
}) => {
  const { reply } = useSelector((state) => state.reply);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const onChangeInputHandler = (e) => {
    inputEl.current.value = e.target.value;
  };

  const focusHandler = () => {
    inputEl.current.focus();
  };
  if (reply) focusHandler();

  useEffect(() => {
    showMenuHandler(() => {
      setShowMenu(false);
    }, showMenu);
  }, [showMenu]);

  return (
    <ChatFooter>
      {reply && (
        <ReplyMessageContainer>
          <ReplyMessageContent>
            <ReplyMessageInfo>
              <ReplyMessageHeader>
                <span>
                  Replying to{" "}
                  <b>
                    {reply.replyee === user.fullname
                      ? "yourself"
                      : reply.replyee}
                  </b>
                </span>
              </ReplyMessageHeader>
              <ReplyMessageText>
                <span className="text">
                  {reply.text !== ""
                    ? reply.text
                    : reply.haveImages
                    ? "Images"
                    : reply.haveAttachments
                    ? "Attachments"
                    : "......."}
                </span>
              </ReplyMessageText>
            </ReplyMessageInfo>
            <ReplyMessageBtn
              onClick={() => dispatch(replyActions.setReply({ reply: null }))}
            >
              <div>
                <IoClose />
              </div>
            </ReplyMessageBtn>
          </ReplyMessageContent>
        </ReplyMessageContainer>
      )}
      {images.length !== 0 && (
        <FilesContainer>
          <FilesContent>
            <FilesInfo>
              {images.map(({ url, name }, index) => {
                return (
                  <Files key={index}>
                    <img src={url} alt="" />
                    <FilesBtn
                      onClick={() => {
                        removeImageInBuffers(url, name);
                      }}
                    >
                      <IoClose />
                    </FilesBtn>
                  </Files>
                );
              })}
            </FilesInfo>
            <label htmlFor="images">
              <AnotherFilesBtn>
                <MdOutlineAddPhotoAlternate />
              </AnotherFilesBtn>
            </label>
          </FilesContent>
        </FilesContainer>
      )}

      {attachments.length !== 0 && (
        <FilesContainer>
          <FilesContent>
            <FilesInfo>
              {attachments.map(({ name, size }, index) => {
                return (
                  <Attachments key={index}>
                    <div className="attachments-content">
                      <div className="attachments-btn">
                        <AiFillFileText />
                      </div>
                      <div className="attachments-info">{name}</div>
                    </div>
                    <FilesBtn
                      onClick={() => {
                        removeAttachmentInBuffers(size, name);
                      }}
                    >
                      <IoClose />
                    </FilesBtn>
                  </Attachments>
                );
              })}
            </FilesInfo>
            <label htmlFor="attachment">
              <AnotherFilesBtn>
                <BsFiles />
              </AnotherFilesBtn>
            </label>
          </FilesContent>
        </FilesContainer>
      )}

      <InputGroup>
        <div className="images">
          <label htmlFor="images">
            <ImImages />
          </label>
          <input
            ref={imagesRef}
            type="file"
            style={{ display: "none" }}
            id="images"
            onChange={multipleImagesHandler}
            multiple
            accept="image/*"
          />
        </div>

        <div className="attachment">
          <label htmlFor="attachment">
            <ImAttachment />
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            id="attachment"
            multiple
            onChange={multipleAttachmentsHandler}
            ref={attachmentsRef}
            accept=".xlsx,.xls,.doc, .docx, .ppt, .pptx,.txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </div>
        <div className="enter-text">
          <input
            type="text"
            placeholder="Enter your message..."
            onChange={onChangeInputHandler}
            ref={inputEl}
          ></input>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {showMenu && (
            <EmojiPicker
              onEmojiSelect={(e) => {
                inputEl.current.value += e.native;
              }}
            />
          )}

          <MdOutlineInsertEmoticon
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          />
        </div>
      </InputGroup>
      <button
        type="submit"
        onClick={(e) => {
          clickHandler(e, inputEl.current.value);
          inputEl.current.value = "";
        }}
      >
        <RiMailSendLine />
      </button>
    </ChatFooter>
  );
};
export default Input;
