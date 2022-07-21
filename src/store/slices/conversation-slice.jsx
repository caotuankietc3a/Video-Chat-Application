import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversation: {},
    rendering: false,
  },
  reducers: {
    setConversation(state, action) {
      state.conversation = action.payload.conversation;
    },
    setRedering(state, _action) {
      state.rendering = !state.rendering;
    },
    setStatus(state, action) {
      state.conversation.status = action.payload.status;
    },
    setMembers(state, action) {
      state.conversation.members = action.payload.members;
    },
  },
});
export const conversationActions = conversationSlice.actions;
export default conversationSlice;
