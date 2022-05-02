import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import userLoginSlice from './user-login-slice';
import conversationSlice from './conversation-slice';
import friendSlice from './friend-slice';
import messageSlice from './message-slice';
import videoSlice from './video-chat-slice';
import socketSlice from './socket-slice';

const store = configureStore({
   middleware: getDefaultMiddleware({
      serializableCheck: false,
   }),
   reducer: {
      user: userLoginSlice.reducer,
      conversation: conversationSlice.reducer,
      messages: messageSlice.reducer,
      friend: friendSlice.reducer,
      video: videoSlice.reducer,
      socket: socketSlice.reducer
   },
});

export default store;
