import {
  FriendCol,
  FriendColBody,
  AvatarUser,
  FriendName,
} from "./StyledFriendShow.jsx";
const FriendShow = () => {
  return (
    <FriendColBody>
      <AvatarUser>
        <img src="/images/user-img.jpg" alt="User" />
      </AvatarUser>
      <FriendName>
        <div>
          <h6 className="text-truncate">Cao Tuan Kiet</h6>
        </div>
        <div>
          <p className="status">offline</p>
        </div>
      </FriendName>
    </FriendColBody>
  );
};

export default FriendShow;
