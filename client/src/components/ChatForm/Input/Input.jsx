import React, { useRef, useEffect, useState } from "react";
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
} from "./StyledInput";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineInsertEmoticon } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { ImImages, ImAttachment } from "react-icons/im";

import { useSelector, useDispatch } from "react-redux";
import { replyActions } from "../../../store/slices/reply-slice";
import EmojiPicker from "../../UI/EmojiPicker/EmojiPicker";
import { showMenuHandler } from "../../../store/actions/common-function";

const Input = ({ clickHandler }) => {
  const { reply } = useSelector((state) => state.reply);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  console.log(showMenu);

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
    // const checkIsClickOutside = (e) => {
    //   if (showMenu) setShowMenu(false);
    // };
    // document.addEventListener("click", checkIsClickOutside);
    // return () => {
    //   document.removeEventListener("click", checkIsClickOutside);
    // };
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

      <InputGroup>
        <div className="images">
          <label htmlFor="images">
            <ImImages />
          </label>
          <input type="file" style={{ display: "none" }} id="images" />
        </div>

        <div className="attachment">
          <label htmlFor="attachmemt">
            <ImAttachment />
          </label>
          <input type="file" style={{ display: "none" }} id="attachmemt" />
        </div>
        <input
          type="text"
          placeholder="Enter your message..."
          onChange={onChangeInputHandler}
          ref={inputEl}
        ></input>
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
        }}
      >
        <RiMailSendLine />
      </button>
    </ChatFooter>
  );
};

export default Input;
