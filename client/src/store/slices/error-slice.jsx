import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload.error;
    },
  },
});

export const errorActions = errorSlice.actions;
export default errorSlice;
