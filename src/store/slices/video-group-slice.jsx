import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  peers: [],
  userVideo: null,
};

const videoGroupSlice = createSlice({
  name: "videoGroup",
  initialState,
  reducers: {},
});

export const videoGroupActions = videoGroupSlice.actions;
export default videoGroupSlice;
