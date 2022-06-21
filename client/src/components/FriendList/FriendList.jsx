import {
  Container,
  Content,
  Header,
  Body,
  SearchBar,
  FriendCol,
  Footer,
  GroupName,
} from "./StyledFriendList";
import { IoClose } from "react-icons/io5";
import { useState, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import FriendShow from "./FriendShow/FriendShow";
import { useSelector, useDispatch } from "react-redux";
import {
  postNewConversation,
  postNewGroupConversation,
} from "../../store/actions/conversation-function";
import { useNavigate } from "react-router-dom";
import { forwardActions } from "../../store/slices/forward-slice";
const FriendList = ({ isClosedHandler, friends, createGroup }) => {
  console.log(friends);
  const navigate = useNavigate();
  const inputFileEl = useRef(null);
  const { user } = useSelector((state) => state.user);
  const { forward } = useSelector((state) => state.forward);
  const { socket_chat } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [no_members, setNo_Members] = useState([user._id]);
  const [groupName, setGroupName] = useState("");
  const [groupImg, setGroupImg] = useState("");

  const pushArrayMembers = (mem) => {
    setNo_Members((preMems) => {
      const index = preMems.findIndex((el) => el === mem);
      if (index !== -1) return [...preMems];
      return [...preMems, mem];
    });
  };

  const popArrayMembers = (mem) => {
    setNo_Members((preMems) => {
      const index = preMems.findIndex((el) => el === mem);
      if (index !== -1) {
        preMems.splice(index, 1);
        return [...preMems];
      }
      return [...preMems];
    });
  };

  const groupNameHandle = (e) => {
    setGroupName(e.target.value);
  };
  const groupImgHandle = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setGroupImg(reader.result);
    };
    reader.readAsDataURL(inputFileEl?.current.files[0]);
  };

  const friendsHandler = (friends, searchText, createGroup = false) => {
    return friends
      ?.filter((friend) => {
        if (createGroup && friend.isGroup) return false;
        return true;
      })
      ?.filter((friend) => {
        if (searchText === "") return true;
        if (friend.fullname.toLowerCase().includes(searchText.toLowerCase()))
          return true;
        return false;
      })
      .map((friend, i) => (
        <FriendShow
          key={i}
          type={
            forward
              ? "forward-message"
              : createGroup
              ? "create-group"
              : "new-chat"
          }
          friend={friend}
          moveToConversationDetail={() => moveToConversationDetail(friend)}
          forwardToUserHandler={() => {
            forwardToUserHandler(friend);
          }}
          pushArrayMembers={pushArrayMembers}
          popArrayMembers={popArrayMembers}
        />
      ));
  };

  const moveToConversationDetail = (friendDetail) => {
    dispatch(postNewConversation(user, friendDetail, navigate));
    isClosedHandler();
  };

  const forwardToUserHandler = (friend) => {
    socket_chat.emit("forward-message", {
      forward: forward ? { ...forward, forwardee: friend } : null,
    });
    dispatch(
      forwardActions.setForward({ forward: { ...forward, forwardee: friend } })
    );
  };

  return (
    <Container>
      <Content>
        <Header>
          <div>
            <h5>
              {forward
                ? "Forward message"
                : createGroup
                ? "Create new group"
                : user.fullname}
            </h5>
          </div>
          <div className="btn-close" onClick={isClosedHandler}>
            <IoClose />
          </div>
        </Header>
        <Body>
          {createGroup && (
            <>
              <GroupName>
                <label>Group name</label>
                <input
                  type="text"
                  placeholder="Type group name here"
                  onChange={groupNameHandle}
                ></input>
              </GroupName>
              <GroupName>
                <div>
                  <label className="label">Choose profile picture</label>
                  <div className="custom-file" onChange={groupImgHandle}>
                    <label htmlFor="upload-file" className="choose-file">
                      Choose file
                    </label>
                    <input
                      type="file"
                      id="upload-file"
                      hidden={true}
                      ref={inputFileEl}
                    ></input>
                  </div>
                </div>
              </GroupName>
            </>
          )}
          <SearchBar>
            <input
              type="text"
              placeholder={
                forward
                  ? "Search user to forward message....."
                  : createGroup
                  ? "Search users to create a new group....."
                  : "Search user to start a new conversation....."
              }
              onChange={(e) => setInputText(e.target.value)}
            />
            <div>
              <BsSearch />
            </div>
          </SearchBar>
          <FriendCol>
            {friendsHandler(friends, inputText, createGroup)}
          </FriendCol>
        </Body>
        {createGroup && (
          <Footer>
            <button className="cancel" onClick={isClosedHandler}>
              Cancel
            </button>
            <button
              className="create-group"
              onClick={() => {
                dispatch(
                  postNewGroupConversation(
                    navigate,
                    dispatch,
                    {
                      members: no_members,
                      groupImg,
                      groupName,
                    },
                    isClosedHandler
                  )
                );
              }}
            >
              Create Group
            </button>
          </Footer>
        )}
      </Content>
    </Container>
  );
};

export default FriendList;
