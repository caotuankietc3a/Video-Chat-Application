import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    reRender: null,
  },
  reducers: {
    setReRender(state, action) {
      state.reRender = action.payload.reRender;
    },
  },
});
export const messageActions = messageSlice.actions;
export default messageSlice;
