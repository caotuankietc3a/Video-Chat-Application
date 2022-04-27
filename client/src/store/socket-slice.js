import {createSlice} from '@reduxjs/toolkit';
import io from "socket.io-client";

const END_POINT = "http://localhost:5000";
const socketSlice = createSlice({
   name: 'socket',
   initialState: {
      socket: io(END_POINT, {transports: ['websocket']})
   }
});
export default socketSlice;
