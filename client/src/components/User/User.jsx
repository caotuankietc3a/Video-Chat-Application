import React, { useEffect, useState } from "react";
import { UserContainer, UserContent } from "./StyledUser.jsx";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
const User = (props) => {
  const { user } = props;
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    let timer = setTimeout(() => {
      setIsFetching(false);
    }, 1250);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <UserContainer>
      {isFetching ? (
        <TikTokSpinner />
      ) : (
        <UserContent>
          <div className="avar-img">
            <img src={user?.profilePhoto} alt="User" />
          </div>
          <h5>Welcome, {user?.fullname}</h5>
          <p>Please select a chat to start messaging.</p>
          <button>Start a conversation</button>
        </UserContent>
      )}
    </UserContainer>
  );
};

export default User;
