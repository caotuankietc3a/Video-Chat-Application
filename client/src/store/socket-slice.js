import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

// const END_POINT = "http://localhost:5000";
// const END_POINT = process.env.REACT_APP_ENDPOINT_SERVER + "/chat-message";
console.log(process.env.REACT_APP_ENDPOINT_SERVER);
const END_POINT = "http://localhost:5000/chat-room";
const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: io(END_POINT, {
      transports: ["websocket"],
    }),
  },
});
export default socketSlice;
