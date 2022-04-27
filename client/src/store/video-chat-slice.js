import {createSlice} from '@reduxjs/toolkit';
const videoSlice = createSlice({
   name: 'video',
   initialState: {
      callAccepted: false,
      callEnded: false,
      stream: null,
      name: "",
      call: {
         isRecievedCall: false,
         caller: null,
         callee: null,
         signal: null
      }
   },
   reducers: {
      setStream(state, action) {
         state.stream = action.payload.stream;
      },
      setCall(state, action) {
         state.call = action.payload.call;
      },
      // setMe(state, action) {
      //    state.me = action.payload.me;
      // },
      setCallAccepted(state, action) {
         state.callAccepted = action.payload.callAccepted;
      },
      setCallEndded(state, action) {
         state.callEnded = action.payload.callEnded;
      }
   },
});

export const videoActions = videoSlice.actions;
export default videoSlice;
