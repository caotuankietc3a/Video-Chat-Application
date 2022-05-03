import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userLoginSlice from "./slices/user-login-slice";
import conversationSlice from "./slices/conversation-slice";
import friendSlice from "./slices/friend-slice";
import messageSlice from "./slices/message-slice";
import videoSlice from "./slices/video-chat-slice";
import socketSlice from "./slices/socket-slice";

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
    socket: socketSlice.reducer,
  },
});

export default store;
