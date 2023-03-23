import { createSlice } from "@reduxjs/toolkit";

const forwardSlice = createSlice({
  name: "forward",
  initialState: {
    forward: null,
  },
  reducers: {
    setForward(state, action) {
      state.forward = action.payload.forward;
    },
  },
});
export const forwardActions = forwardSlice.actions;
export default forwardSlice;
