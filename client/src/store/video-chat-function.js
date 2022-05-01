import Peer from "simple-peer";
import { videoActions } from "./video-chat-slice";
export const videoStreamStart = (callback) => {
  return async (dispatch) => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log(currentStream);
      dispatch(videoActions.setStream({ stream: currentStream }));
      callback(currentStream);
    } catch (err) {
      console.error(err);
    }
  };
};

export const answerCall = (socket_video, userVideoCb, connectionCb) => {
  return async (dispatch, getState) => {
    const { _id } = getState().conversation.conversation;
    const { call, stream } = getState().video;
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });

    dispatch(videoActions.setCallAccepted({ callAccepted: true }));

    peer.on("signal", (data) => {
      socket_video.emit("answer-call", { signal: data, conversationId: _id });
    });

    peer.on("stream", (currentStream) => {
      // userVideo.current.srcObject = currentStream;
      userVideoCb(currentStream);
    });

    peer.signal(call.signal);

    // connection.current = peer;
    connectionCb(peer);
  };
};

export const callUser = (socket_video, userVideoCb, connectionCb) => {
  return (dispatch, getState) => {
    const { stream } = getState().video;
    const { _id } = getState().conversation.conversation;
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    peer.on("signal", (data) => {
      socket_video.emit("call-user", {
        conversationId: _id,
        signal: data,
      });
    });

    peer.on("stream", (currentStream) => {
      // userVideo.current.srcObject = currentStream;
      userVideoCb(currentStream);
    });

    socket_video.on("accept-call", ({ signal }) => {
      dispatch(videoActions.setCallAccepted({ callAccepted: true }));
      peer.signal(signal);
    });

    // connection.current = peer;
    connectionCb(peer);
  };
};

export const rejectCall = (navigate, stream) => {
  return async (dispatch) => {
    stream?.getTracks().forEach(function (track) {
      track.stop();
    });

    // Becarefull the order of navigate and dispatch
    navigate(`/home-chat`);
    dispatch(videoActions.setVideoState());
  };
};

export const leaveCall = () => {
  return (dispatch) => {
    dispatch(videoActions.setCallEndded({ callEnded: true }));
    window.location.reload();
  };
};
