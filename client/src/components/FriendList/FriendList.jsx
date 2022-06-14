import {
  Container,
  Content,
  Header,
  Body,
  SearchBar,
  FriendCol,
} from "./StyledFriendList";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import FriendShow from "./FriendShow/FriendShow";
import { useSelector, useDispatch } from "react-redux";
import { postNewConversation } from "../../store/actions/conversation-function";
import { useNavigate } from "react-router-dom";
import { forwardActions } from "../../store/slices/forward-slice";
const FriendList = ({ isClosedHandler }) => {
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const { user } = useSelector((state) => state.user);
  const { forward } = useSelector((state) => state.forward);
  const { socket_chat } = useSelector((state) => state.socket);
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const resFriends = await fetch(
          `${END_POINT_SERVER}/friend/${user ? user._id : "error"}`,
          {
            credentials: "include",
          }
        );

        const friends = await resFriends.json();
        setFriends(friends);
        // setTimeout(() => {
        //   setIsFetching(false);
        // }, 1250);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const friendsHandler = (friends, searchText) => {
    return friends
      ?.filter((friend) => {
        if (searchText === "") return true;
        if (friend.fullname.toLowerCase().includes(searchText.toLowerCase()))
          return true;
        return false;
      })
      .map((friend, i) => (
        <FriendShow
          key={i}
          type={forward ? "forward-message" : null}
          friend={friend}
          moveToConversationDetail={() => moveToConversationDetail(friend)}
          forwardToUserHandler={() => {
            forwardToUserHandler(friend);
          }}
        />
      ));
  };

  const moveToConversationDetail = (friendDetail) => {
    dispatch(postNewConversation(user, friendDetail, navigate));
    isClosedHandler();
  };

  const forwardToUserHandler = (friend) => {
    socket_chat.emit("forward-message", {
      userId: user._id,
      forward: forward ? { ...forward, forwardee: friend } : null,
    });
    // dispatch(forwardActions.setForward({ forward: null }));
  };

  return (
    <Container>
      <Content>
        <Header>
          <div>
            <h5>{forward ? "Forward" : user.fullname}</h5>
          </div>
          <div className="btn-close" onClick={isClosedHandler}>
            <IoClose />
          </div>
        </Header>
        <Body>
          <SearchBar>
            <input
              type="text"
              placeholder={
                forward
                  ? "Search user to forward message....."
                  : "Search user to start a new conversation....."
              }
              onChange={(e) => setInputText(e.target.value)}
            />
            <div>
              <BsSearch />
            </div>
          </SearchBar>
          <FriendCol>{friendsHandler(friends, inputText)}</FriendCol>
        </Body>
      </Content>
    </Container>
  );
};

export default FriendList;
