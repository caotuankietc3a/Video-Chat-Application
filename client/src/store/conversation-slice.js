import {createSlice} from '@reduxjs/toolkit';

const conversationSlice = createSlice({
   name: 'conversation',
   initialState: {
      conversation: null,
      rendering: false
   },
   reducers: {
      setConversation(state, action) {
         state.conversation = action.payload.conversation;
      },
      setRedering(state, action) {
         state.rendering = !state.rendering;
      }
   },
});
export const conversationActions = conversationSlice.actions;
export default conversationSlice;
