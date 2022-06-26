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
  ImagesContainer,
  ImagesContent,
  ImageBtn,
  Image,
  AnotherImagesBtn,
  ImagesInfo,
} from "./StyledInput";
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ImImages, ImAttachment } from "react-icons/im";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

import { useSelector, useDispatch } from "react-redux";
import { replyActions } from "../../../store/slices/reply-slice";
import EmojiPicker from "../../UI/EmojiPicker/EmojiPicker";
import { showMenuHandler } from "../../../store/actions/common-function";

const Input = ({
  clickHandler,
  imagesRef,
  multipleImagesHandler,
  images,
  removeImageInBuffers,
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
                <span className="text">{reply.text}</span>
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
        <ImagesContainer>
          <ImagesContent>
            <ImagesInfo>
              {images.map((img, index) => {
                return (
                  <Image key={index}>
                    <img src={img} alt="" />
                    <ImageBtn>
                      <IoClose
                        onClick={() => {
                          removeImageInBuffers(img);
                        }}
                      />
                    </ImageBtn>
                  </Image>
                );
              })}
            </ImagesInfo>
            <label htmlFor="images">
              <AnotherImagesBtn>
                <MdOutlineAddPhotoAlternate />
              </AnotherImagesBtn>
            </label>
          </ImagesContent>
        </ImagesContainer>
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
          <label htmlFor="attachmemt">
            <ImAttachment />
          </label>
          <input type="file" style={{ display: "none" }} id="attachmemt" />
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
