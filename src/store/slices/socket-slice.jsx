import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

// const END_POINT = "http://localhost:5000";
const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket_chat: io(`${END_POINT_SERVER}/chat-room`, {
      transports: ["websocket"],
    }),
    socket_video: io(`${END_POINT_SERVER}/video-room`, {
      transports: ["websocket"],
    }),
    socket_group_video: io(`${END_POINT_SERVER}/group-video-room`, {
      transports: ["websocket"],
    }),
    socket_notify: io(`${END_POINT_SERVER}/notify`, {
      transports: ["websocket"],
    }),
  },
  reducers: {
    setSocket_Video(state, _action) {
      state.socket_video = io(`${END_POINT_SERVER}/video-room`, {
        transports: ["websocket"],
      });
    },
    setSocket_Group_Video(state, _action) {
      state.socket_group_video = io(`${END_POINT_SERVER}/group-video-room`, {
        transports: ["websocket"],
      });
    },
    setSocket_Chat(state, _action) {
      state.socket_chat = io(`${END_POINT_SERVER}/chat-room`, {
        transports: ["websocket"],
      });
    },
    setSocket_Notify(state, _action) {
      state.socket_notify = io(`${END_POINT_SERVER}/notify`, {
        transports: ["websocket"],
      });
    },
  },
});
export const socketActions = socketSlice.actions;
export default socketSlice;
