import Peer from "simple-peer";
import { errorActions } from "../slices/error-slice";
export const createPeer = (
  userToSignal,
  stream,
  conversationId,
  callerId,
  socket_video,
  setPeers,
  peersRef
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

  peer.on("stream", (stream) => {
    const index = peersRef.current.findIndex(
      ({ peerInfo }) => peerInfo.peerId === userToSignal
    );
    if (index !== -1) {
      setPeers((prePeers) => {
        prePeers[index].stream = stream;
        return [...prePeers];
      });
      peersRef.current[index].stream = stream;
    }
  });
  return peer;
};

export const addPeer = (
  inCommingSignal,
  callerId,
  stream,
  socket_video,
  setPeers,
  peersRef
) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: stream,
  });

  peer.on("signal", (signal) => {
    socket_video.emit("returning-signal", { callerId, signal });
  });

  peer.on("stream", (stream) => {
    const index = peersRef.current.findIndex(
      ({ peerInfo }) => peerInfo.peerId === callerId
    );
    if (index !== -1) {
      setPeers((prePeers) => {
        prePeers[index].stream = stream;
        return [...prePeers];
      });
      peersRef.current.stream = stream;
    }
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

export const shareGroupScreen = (screenStream, stream, peers) => {
  const screenTrack = screenStream.getTracks()[0];
  const videoTrack = stream.getTracks().find((track) => track.kind === "video");

  screenTrack.onended = (e) => {
    peers.forEach(({ peer }) => {
      peer.replaceTrack(screenTrack, videoTrack, stream);
    });
  };

  peers.forEach(({ peer }) => {
    peer.replaceTrack(videoTrack, screenTrack, stream);
  });
};
