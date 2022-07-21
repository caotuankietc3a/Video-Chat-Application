import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    friend: null,
    friends: null,
  },
  reducers: {
    setFriend(state, action) {
      state.friend = action.payload.friend;
    },
    setFriends(state, action) {
      state.friends = action.payload.friends;
    },
  },
});
export const friendActions = friendSlice.actions;
export default friendSlice;
