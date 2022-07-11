import {
  Container,
  Content,
  Header,
  Body,
  SearchBar,
  FriendCol,
  Footer,
  GroupName,
  DialogInvitation,
  DialogInvitationContainer,
} from "./StyledFriendList";
import { IoClose } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import FriendShow from "./FriendShow/FriendShow";
import { useSelector, useDispatch } from "react-redux";
import {
  postNewConversation,
  postNewGroupConversation,
} from "../../store/actions/conversation-function";
import { useNavigate } from "react-router-dom";
import { forwardActions } from "../../store/slices/forward-slice";
import BouncyLoading from "../UI/BouncyLoading/BouncyLoading";
import { postInvitationMessage } from "../../store/actions/invite-function";
const { v4: uuidv4 } = require("uuid");
const FriendList = ({ isClosedHandler, friends, createGroup, invite }) => {
  const navigate = useNavigate();
  const inputFileEl = useRef(null);
  const invitationRef = useRef({});
  const { user } = useSelector((state) => state.user);
  const { forward } = useSelector((state) => state.forward);
  const { socket_chat } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const [no_members, setNo_Members] = useState([user._id]);
  const [groupName, setGroupName] = useState("");
  const [groupImg, setGroupImg] = useState("");
  const [isFetching, setIsFetching] = useState(false);

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
          isFetching
          friend={friend}
          moveToConversationDetail={() => {
            moveToConversationDetail(friend);
          }}
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
    const id = uuidv4();
    socket_chat.emit("forward-message", {
      forward: forward ? { ...forward, id, forwardee: friend } : null,
    });
    dispatch(
      forwardActions.setForward({
        forward: { ...forward, forwardee: friend, id },
      })
    );
  };

  const createNewGroupConversation = () => {
    setIsFetching(true);
    dispatch(
      postNewGroupConversation(
        navigate,
        dispatch,
        {
          members: no_members,
          groupImg: groupImg,
          groupName: groupName.trim(),
        },
        isClosedHandler,
        setIsFetching
      )
    );
  };

  const createInvitaionMessage = async () => {
    setIsFetching(true);
    await postInvitationMessage(
      { ...invitationRef.current, senderEmail: user.email },
      () => {
        setIsFetching(false);
        isClosedHandler();
      }
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();
    createGroup ? createNewGroupConversation() : createInvitaionMessage();
  };

  return (
    <Container onSubmit={submitHandler}>
      <Content>
        <Header>
          <div>
            <h5>
              {forward
                ? "Forward message"
                : createGroup
                ? "Create new group"
                : invite
                ? "Invite Others"
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
                      accept="image/*"
                    ></input>
                  </div>
                </div>
              </GroupName>
            </>
          )}

          {invite && (
            <DialogInvitationContainer>
              <DialogInvitation>
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  required={true}
                  placeholder="Type email address here"
                  onChange={(e) => {
                    invitationRef.current.receiverEmail = e.target.value;
                  }}
                />
              </DialogInvitation>

              <DialogInvitation>
                <label>Invitation message</label>
                <textarea
                  placeholder="Type your messages here"
                  required={true}
                  onChange={(e) => {
                    invitationRef.current.textArea = e.target.value;
                  }}
                />
              </DialogInvitation>
            </DialogInvitationContainer>
          )}
          {!invite && (
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
          )}
          {!invite && (
            <FriendCol>
              {friendsHandler(friends, inputText, createGroup)}
            </FriendCol>
          )}
        </Body>
        {(createGroup || invite) && (
          <Footer type={invite ? "invite" : "create-group"}>
            <button className="cancel" onClick={isClosedHandler}>
              Cancel
            </button>
            {!isFetching ? (
              <button
                className="create-group"
                // onClick={
                //   createGroup
                //     ? createNewGroupConversation
                //     : createInvitaionMessage
                // }
              >
                {createGroup && "Create group"}
                {invite && "Send Invitation"}
              </button>
            ) : (
              <BouncyLoading
                height="18px"
                width="106px"
                translateY1="0px"
                translateY2="-15px"
              />
            )}
          </Footer>
        )}
      </Content>
    </Container>
  );
};

export default FriendList;
