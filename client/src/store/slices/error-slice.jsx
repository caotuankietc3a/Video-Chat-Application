import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  notify: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload.error;
    },

    setNotify(state, action) {
      state.notify = action.payload.notify;
    },

    setErrorNotify(state, _action) {
      state.notify = null;
      state.error = null;
    },
  },
});

export const errorActions = errorSlice.actions;
export default errorSlice;
