import { FriendColBody, AvatarUser, FriendName } from "./StyledFriendShow.jsx";
const FriendShow = ({
  friend,
  moveToConversationDetail,
  forwardToUserHandler,
  type,
}) => {
  return (
    <FriendColBody
      onClick={
        type === "forward-message"
          ? forwardToUserHandler
          : moveToConversationDetail
      }
    >
      <AvatarUser>
        <img src={friend.profilePhoto} alt="User" />
      </AvatarUser>
      <FriendName>
        <div>
          <h6 className="text-truncate">{friend.fullname}</h6>
        </div>
        <div>
          <p className="status">{friend.timestamps ? "Online" : "Offline"}</p>
        </div>
      </FriendName>
    </FriendColBody>
  );
};

export default FriendShow;
