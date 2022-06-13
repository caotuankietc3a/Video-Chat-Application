import {
  Container,
  Content,
  Header,
  Body,
  SearchBar,
  FriendCol,
} from "./StyledFriendList";
import { IoClose } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import FriendShow from "./FriendShow/FriendShow";
import { useSelector, useDispatch } from "react-redux";
import { postNewConversation } from "../../store/actions/conversation-function";
import { useNavigate } from "react-router-dom";
const FriendList = ({ isClickedHandler }) => {
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const { user } = useSelector((state) => state.user);
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
          friend={friend}
          moveToConversationDetail={() => moveToConversationDetail(friend)}
        />
      ));
  };

  const moveToConversationDetail = (friendDetail) => {
    dispatch(postNewConversation(user, friendDetail, navigate));
    isClickedHandler();
  };

  return (
    <Container>
      <Content>
        <Header>
          <div>
            <h5>{user.fullname}</h5>
          </div>
          <div className="btn-close" onClick={isClickedHandler}>
            <IoClose />
          </div>
        </Header>
        <Body>
          <SearchBar>
            <input
              type="text"
              placeholder="Search user....."
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
