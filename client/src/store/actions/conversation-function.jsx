import { convertLength } from "@mui/material/styles/cssUtils";
import { conversationActions } from "../slices/conversation-slice";
import { postData } from "./fetch-action";
const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
export const postNewConversation = (user, friendDetail, navigate) => {
  return async (dispatch) => {
    const conversation = await postData(
      { friend: friendDetail, userId: user._id },
      `${END_POINT_SERVER}/conversation/new-conversation`
    );
    console.log(conversation);
    const member = conversation.members.find(
      (member) => member._id !== user._id
    );
    dispatch(
      conversationActions.setConversation({
        conversation: {
          _id: conversation._id,
          members: conversation.members,
          name: member.fullname,
        },
      })
    );
    navigate(`/home-chat/conversation/detail/${conversation._id}`);
  };
};
