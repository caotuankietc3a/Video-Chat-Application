import { conversationActions } from "../slices/conversation-slice";
import { errorActions } from "../slices/error-slice";
import { replyActions } from "../slices/reply-slice";
import { formatDate } from "./common-function";
import { postData } from "./fetch-action";
const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
export const postNewConversation = (user, friendDetail, navigate) => {
  return async (dispatch, getState) => {
    try {
      if (user) {
        const { socket_notify, socket_chat } = getState().socket;
        const conversation = await postData(
          { friend: friendDetail, userId: user._id },
          `${END_POINT_SERVER}/conversation/new-conversation`
        );
        socket_notify.emit("post-new-conversation");
        socket_chat.emit("join-chat", {
          conversationId: conversation._id,
          userId: user._id,
        });
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
                profilePhoto: member.user.profilePhoto,
              },
            })
          );
        }
        navigate(`/home-chat/conversation/detail/${conversation._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };
};

export const postNewGroupConversation = (
  navigate,
  dispatch,
  { members, groupImg, groupName },
  isClosedHandler,
  setIsFetching
) => {
  if (groupName.trim() === "") {
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
    setIsFetching(false);
    socket_notify.emit("post-new-group-conversation");
    navigate(`/home-chat/conversation/detail/${group_conversation._id}`);
    isClosedHandler();
  };
};

export const fetchDetailConversation = ({ id, userId }) => {
  return async (dispatch, _getState) => {
    try {
      const res = await fetch(`${END_POINT_SERVER}/conversation/detail/` + id);
      const conversation = await res.json();

      if (conversation && conversation.members) {
        if (
          conversation.members.length === 2 &&
          conversation.profilePhoto.cloudinary_id === "" &&
          conversation.profilePhoto.name === ""
        ) {
          const member = conversation.members.find(
            (member) => member.user._id !== userId
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
                profilePhoto: member.user.profilePhoto,
                status: member.user.status,
              },
            })
          );
        } else {
          dispatch(
            conversationActions.setConversation({
              conversation: {
                _id: conversation._id,
                members: conversation.members,
                name: conversation.name,
                time: formatDate(new Date(Date.now())),
                no_mems: conversation.members.length,
                profilePhoto: conversation.profilePhoto,
                status: true,
              },
            })
          );
        }
        dispatch(replyActions.setReply({ reply: null }));
      }
    } catch (err) {
      console.error(err);
    }
  };
};
