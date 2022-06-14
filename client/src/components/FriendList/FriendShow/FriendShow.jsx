import { useRef, useState, useEffect } from "react";
import { BsEnvelopeFill, BsEnvelopeOpenFill } from "react-icons/bs";
import { FiSend } from "react-icons/fi";

import {
  FriendColBody,
  AvatarUser,
  FriendName,
  SendBtn,
} from "./StyledFriendShow.jsx";
const FriendShow = ({
  friend,
  moveToConversationDetail,
  forwardToUserHandler,
  type,
}) => {
  const disabledBtnEl = useRef(null);
  const [undoEl, setUndoEl] = useState(false);
  useEffect(() => {
    let timer = setTimeout(() => {
      if (undoEl) {
        disabledBtnEl.current.disabled = true;
        disabledBtnEl.current.parentElement.classList.add("un-send");
        forwardToUserHandler();
        setUndoEl(false);
      }
    }, 3500);
    return () => {
      clearTimeout(timer);
    };
  }, [undoEl]);

  const undoHandler = () => {
    setUndoEl(!undoEl);
    console.log(
      disabledBtnEl.current?.parentElement?.classList?.contains("un-send")
    );
    console.log(disabledBtnEl.current);
  };
  return (
    <FriendColBody
      onClick={type !== "forward-message" ? moveToConversationDetail : null}
    >
      <AvatarUser>
        <img src={friend.profilePhoto} alt="User" />
      </AvatarUser>
      <FriendName type={type}>
        <div className="sendBtn">
          <h6>{friend.fullname}</h6>
          {type === "forward-message" && (
            <SendBtn onClick={undoHandler}>
              <div>
                {disabledBtnEl.current?.parentElement?.classList?.contains(
                  "un-send"
                ) ? (
                  <FiSend />
                ) : undoEl ? (
                  <BsEnvelopeFill />
                ) : (
                  <FiSend />
                )}
              </div>
              <button type="button" ref={disabledBtnEl}>
                {disabledBtnEl.current?.parentElement?.classList?.contains(
                  "un-send"
                )
                  ? "Sent"
                  : undoEl
                  ? "Undo"
                  : "Send"}
              </button>
            </SendBtn>
          )}
        </div>
        {type !== "forward-message" && (
          <div>
            <p className="status">{friend.timestamps ? "Online" : "Offline"}</p>
          </div>
        )}
      </FriendName>
    </FriendColBody>
  );
};

export default FriendShow;