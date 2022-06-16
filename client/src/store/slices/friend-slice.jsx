import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    friend: null,
  },
  reducers: {
    setFriends(state, action) {
      state.friend = action.payload.friend;
    },
  },
});
export const friendActions = friendSlice.actions;
export default friendSlice;
