import { conversationActions } from "../slices/conversation-slice";
import { errorActions } from "../slices/error-slice";
import { formatDate } from "./common-function";
import { postData } from "./fetch-action";
const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
export const postNewConversation = (user, friendDetail, navigate) => {
  return async (dispatch, getState) => {
    const { socket_notify } = getState().socket;
    const conversation = await postData(
      { friend: friendDetail, userId: user._id },
      `${END_POINT_SERVER}/conversation/new-conversation`
    );
    socket_notify.emit("post-new-conversation");
    if (friendDetail.isGroup) {
      dispatch(
        conversationActions.setConversation({
          conversation: {
            _id: conversation._id,
            members: conversation.members,
            name: conversation.name,
            time: formatDate(new Date(Date.now())),
            status: true,
            profilePhoto: conversation.profilePhoto,
            no_mems: conversation.members.length,
          },
        })
      );
    } else {
      const member = conversation.members.find(
        (member) => member.user._id !== user._id
      );
      dispatch(
        conversationActions.setConversation({
          conversation: {
            _id: conversation._id,
            members: conversation.members,
            name: member.user.fullname,
            address: member.user.address,
            email: member.user.email,
            time: formatDate(new Date(Date.now())),
            status: member.user.status,
            profilePhoto: member.user.profilePhoto.url,
          },
        })
      );
    }
    setTimeout(() => {
      navigate(`/home-chat/conversation/detail/${conversation._id}`);
    }, 500);
  };
};

export const postNewGroupConversation = (
  navigate,
  dispatch,
  { members, groupImg, groupName },
  isClosedHandler,
  setIsFetching
) => {
  if (groupName === "") {
    setIsFetching(false);
    return dispatch(
      errorActions.setError({ error: "Please enter a group name!!!" })
    );
  }
  if (groupImg === "" || !groupImg) {
    setIsFetching(false);
    return dispatch(
      errorActions.setError({ error: "Please pick up a image file!!!" })
    );
  }
  if (members.length <= 2) {
    setIsFetching(false);
    return dispatch(
      errorActions.setError({
        error: "Please choose more than 2 users to create a new group!!!",
      })
    );
  }

  return async (dispatch, getState) => {
    const { socket_notify } = getState().socket;
    const group_conversation = await postData(
      { members, groupImg, groupName },
      `${END_POINT_SERVER}/conversation/new-group-conversation`
    );
    dispatch(
      conversationActions.setConversation({
        conversation: {
          _id: group_conversation._id,
          members: group_conversation.members,
          name: group_conversation.name,
          profilePhoto: group_conversation.profilePhoto,
          no_mems: group_conversation.members.length,
          status: true,
        },
      })
    );
    setTimeout(() => {
      setIsFetching(false);
      socket_notify.emit("post-new-group-conversation");
      navigate(`/home-chat/conversation/detail/${group_conversation._id}`);
      isClosedHandler();
    }, 350);
  };
};
