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
  },
});
export default socketSlice;
