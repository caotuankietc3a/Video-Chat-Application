import { conversationActions } from "../slices/conversation-slice";
import { errorActions } from "../slices/error-slice";
import { postData } from "./fetch-action";
import { videoStreamStart } from "./video-chat-function";
const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
export const postNewConversation = (
  user,
  friendDetail,
  navigate,
  type = false
) => {
  return async (dispatch) => {
    const conversation = await postData(
      { friend: friendDetail, userId: user._id },
      `${END_POINT_SERVER}/conversation/new-conversation`
    );
    const member = conversation.members.find(
      (member) => member._id !== user._id
    );
    dispatch(
      conversationActions.setConversation({
        conversation: {
          _id: conversation._id,
          members: conversation.members,
          name: member.fullname,
          status: member.status,
        },
      })
    );
    navigate(`/home-chat/conversation/detail/${conversation._id}`);
    if (type) {
      dispatch(
        videoStreamStart(
          navigate,
          {
            _id: conversation._id,
            members: conversation.members,
            name: member.fullname,
            status: member.status,
          },
          true
        )
      );
    }
  };
};

export const postNewGroupConversation = (
  navigate,
  dispatch,
  { members, groupImg, groupName },
  isClosedHandler
) => {
  if (groupName === "") {
    return dispatch(
      errorActions.setError({ error: "Please enter a group name!!!" })
    );
  }
  if (groupImg === "") {
    return dispatch(
      errorActions.setError({ error: "Please pick up a image file!!!" })
    );
  }
  if (members.length <= 2) {
    return dispatch(
      errorActions.setError({ error: "Please choose more than 2 users!!!" })
    );
  }

  return async (dispatch) => {
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
          status: true,
        },
      })
    );
    isClosedHandler();
    navigate(`/home-chat/conversation/detail/${group_conversation._id}`);
  };
};
