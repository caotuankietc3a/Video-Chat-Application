import Peer from "simple-peer";
import { errorActions } from "../slices/error-slice";
export const createPeer = (
  userToSignal,
  stream,
  conversationId,
  callerId,
  socket_video
) => {
  const peer = new Peer({ initiator: true, trickle: false, stream });

  peer.on("signal", (signal) => {
    socket_video.emit("sending-signal", {
      userToSignal,
      callerId,
      conversationId,
      signal,
    });
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

export const videoGroupStreamStart = async () => {
  try {
    const currentStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return currentStream;
  } catch (err) {
    console.error(err);
  }
};
