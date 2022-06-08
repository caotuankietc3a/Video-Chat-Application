import { UserContainer, UserContent } from "./StyledUser.jsx";
const User = (props) => {
  const { user } = props;
  return (
    <UserContainer>
      <UserContent>
        <div className="avar-img">
          <img src={user?.profilePhoto} alt="User" />
        </div>
        <h5>Welcome, {user?.fullname}</h5>
        <p>Please select a chat to start messaging.</p>
        <button>Start a conversation</button>
      </UserContent>
    </UserContainer>
  );
};

export default User;
