import React from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { replyActions } from "../../../store/slices/reply-slice";

const Input = ({ changeHandler, clickHandler, message }) => {
  const { reply } = useSelector((state) => state.reply);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
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
        <div>
          <IoIosAddCircleOutline />
        </div>
        <input
          type="text"
          placeholder="Enter your message..."
          onChange={changeHandler}
          value={message}
        ></input>
        <div>
          <MdOutlineInsertEmoticon />
        </div>
      </InputGroup>
      <button type="submit" onClick={clickHandler}>
        <RiMailSendLine />
      </button>
    </ChatFooter>
  );
};

export default Input;
