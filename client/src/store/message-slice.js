import {createSlice} from '@reduxjs/toolkit';

const messageSlice = createSlice({
   name: 'message',
   initialState: {
      messages: null
   },
   reducers: {
      setMessages(state, action) {
         state.messages = action.payload.messages;
      }
   },
});
export const messageActions = messageSlice.actions;
export default messageSlice;
