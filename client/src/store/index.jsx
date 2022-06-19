import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userLoginSlice from "./slices/user-login-slice";
import conversationSlice from "./slices/conversation-slice";
import friendSlice from "./slices/friend-slice";
import videoSlice from "./slices/video-chat-slice";
import socketSlice from "./slices/socket-slice";
import callSlice from "./slices/call-slice";
import replySlice from "./slices/reply-slice";
import forwardSlice from "./slices/forward-slice";
import messageSlice from "./slices/message-slice";
import errorSlice from "./slices/error-slice";

const store = configureStore({
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer: {
    user: userLoginSlice.reducer,
    conversation: conversationSlice.reducer,
    friend: friendSlice.reducer,
    video: videoSlice.reducer,
    socket: socketSlice.reducer,
    call: callSlice.reducer,
    reply: replySlice.reducer,
    forward: forwardSlice.reducer,
    message: messageSlice.reducer,
    error: errorSlice.reducer,
  },
});

export default store;
