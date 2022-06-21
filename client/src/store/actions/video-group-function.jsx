import Peer from "simple-peer";
export const createPeer = (userToSignal, stream, callerId, socket_video) => {
  const { socket_video } = getState().video;
  const peer = new Peer({ initiator: true, trickle: false, stream });

  peer.signal("signal", (signal) => {
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

  peer.signal("signal", (signal) => {
    socket_video.emit("returning-signal", { callerId, signal });
  });

  peer.signal(inCommingSignal);

  return peer;
};
