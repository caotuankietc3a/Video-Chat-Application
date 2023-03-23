import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
  name: "call",
  initialState: {
    calls: null,
    meeting: null,
  },
  reducers: {
    setCalls(state, action) {
      state.calls = action.payload.calls;
    },
    setMeeting(state, action) {
      state.meeting = action.payload.meeting;
    },
  },
});
export const callActions = callSlice.actions;
export default callSlice;
