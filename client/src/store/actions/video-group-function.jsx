import Peer from "simple-peer";
import { errorActions } from "../slices/error-slice";
export const createPeer = (userToSignal, stream, callerId, socket_video) => {
  const peer = new Peer({ initiator: true, trickle: false, stream });
  console.log(callerId);
  console.log(socket_video);

  peer.on("signal", (signal) => {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
    socket_video.emit("sending-signal", { userToSignal, callerId, signal });
  });
  return peer;
};

export const addPeer = (inCommingSignal, callerId, stream, socket_video) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: stream,
  });

  peer.on("signal", (signal) => {
    socket_video.emit("returning-signal", { callerId, signal });
  });

  peer.signal(inCommingSignal);

  return peer;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export const videoGroupStreamStart = async () => {
  try {
    const currentStream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: true,
    });
    return currentStream;
  } catch (err) {
    console.error(err);
  }
};
