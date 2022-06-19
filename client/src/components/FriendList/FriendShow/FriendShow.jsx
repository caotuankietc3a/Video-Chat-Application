import { useRef, useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { FaUndo } from "react-icons/fa";
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
  pushArrayMembers,
  popArrayMembers,
  type,
}) => {
  const disabledBtnEl = useRef(null);
  const [undoEl, setUndoEl] = useState(false);
  useEffect(() => {
    let timer = setTimeout(() => {
      if (
        undoEl &&
        !disabledBtnEl.current?.parentElement?.classList?.contains("un-send")
      ) {
        disabledBtnEl.current.disabled = true;
        disabledBtnEl.current.parentElement.classList.add("un-send");
        forwardToUserHandler();
        setUndoEl(false);
      }
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [undoEl]);

  const undoHandler = () => {
    setUndoEl(!undoEl);
  };

  return (
    <FriendColBody
      onClick={type === "new-chat" ? moveToConversationDetail : null}
      className={type === "new-chat" ? "new-chat" : null}
    >
      <AvatarUser status={friend.status}>
        <img src={friend.profilePhoto} alt="User" />
      </AvatarUser>
      <FriendName>
        <div className="sendBtn">
          <h6>{friend.fullname}</h6>
          {type === "forward-message" && (
            <SendBtn onClick={undoHandler} className="forward-message">
              <div>
                {disabledBtnEl.current?.parentElement?.classList?.contains(
                  "un-send"
                ) ? (
                  <FiSend />
                ) : undoEl ? (
                  <FaUndo />
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
          {type === "create-group" && (
            <SendBtn className="create-group">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) pushArrayMembers(friend._id);
                  else popArrayMembers(friend._id);
                }}
              ></input>
            </SendBtn>
          )}
        </div>
        {type === "new-chat" && (
          <div>
            <p className="status">{friend.status ? "Online" : "Offline"}</p>
          </div>
        )}
      </FriendName>
    </FriendColBody>
  );
};

export default FriendShow;
