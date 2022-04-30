import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  callAccepted: false,
  callEnded: false,
  stream: null,
  signal: null,
  call: {
    isReceivedCall: false,
    caller: null,
    callee: null,
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
      state.signal = action.payload.signal;
    },
    setVideoState(state) {
      state.signal = null;
      state.call = {
        isReceivedCall: false,
        caller: null,
        callee: null,
      };
      state.stream = null;
    },
    setCallAccepted(state, action) {
      state.callAccepted = action.payload.callAccepted;
    },
    setCallEndded(state, action) {
      state.callEnded = action.payload.callEnded;
    },
  },
});

export const videoActions = videoSlice.actions;
export default videoSlice;
