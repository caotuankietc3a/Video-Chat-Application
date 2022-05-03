import {createSlice} from '@reduxjs/toolkit';

const userLoginSlice = createSlice({
   name: 'user',
   initialState: {
      user: null,
      isFetching: false,
      error: null,
   },
   reducers: {
      setUserLogin(state, action) {
         state.user = action.payload.user;
         state.isFetching = action.payload.isFetching;
         state.error = action.payload.error;
      },
      setLoginFailed(state, action) {
         state.error = action.payload.error;
         state.isFetching = action.payload.isFetching;
      },
      setIsFetching(state, action) {
         state.isFetching = action.payload.isFetching;
      }
   },
});
export const userLoginActions = userLoginSlice.actions;
export default userLoginSlice;
