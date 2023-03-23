import React, { useEffect, useState } from "react";
import { UserContainer, UserContent } from "./StyledUser.jsx";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
const User = ({ user, isClickedHandler }) => {
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    if (user) setIsFetching(false);
  }, [user]);
  return (
    <UserContainer>
      {isFetching ? (
        <TikTokSpinner />
      ) : (
        <UserContent>
          <div className="avar-img">
            <img src={user?.profilePhoto.url} alt="User" />
          </div>
          <h5>Welcome, {user?.fullname}</h5>
          <p>Please select a chat to start messaging.</p>
          <button onClick={isClickedHandler}>Start a conversation</button>
        </UserContent>
      )}
    </UserContainer>
  );
};

export default User;
