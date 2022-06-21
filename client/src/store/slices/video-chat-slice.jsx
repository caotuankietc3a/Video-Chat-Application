import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connection: null,
  userStream: null,
  callAccepted: false,
  showVideo: false,
  showUserVideo: false,
  stream: null, // myStream
  error: null,
  call: {
    isReceivedCall: false,
    caller: null,
    callees: null,
    signal: null,
  },
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setStream(state, action) {
      state.stream = action.payload.stream;
    },
    setCall(state, action) {
      state.call = action.payload.call;
    },
    setSignal(state, action) {
      state.call.signal = action.payload.signal;
    },
    setVideoState(state) {
      state.call = {
        isReceivedCall: false,
        caller: null,
        callees: null,
        signal: null,
      };
      state.stream = null;
      state.callAccepted = false;
      state.showVideo = false;
      state.showUserVideo = false;
      state.userStream = null;
      state.connection = null;
    },
    setCallAccepted(state, action) {
      state.callAccepted = action.payload.callAccepted;
    },
    setShowVideo(state, action) {
      state.showVideo = action.payload.showVideo;
    },
    setShowUserVideo(state, action) {
      state.showUserVideo = action.payload.showUserVideo;
    },
    setUserStream(state, action) {
      state.userStream = action.payload.userStream;
    },
    setConnection(state, action) {
      state.connection = action.payload.connection;
    },
    setError(state, action) {
      state.error = action.payload.error;
    },
  },
});

export const videoActions = videoSlice.actions;
export default videoSlice;
