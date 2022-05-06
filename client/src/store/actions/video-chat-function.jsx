import Peer from "simple-peer";
import { videoActions } from "../slices/video-chat-slice";
export const videoStreamStart = () => {
  return async (dispatch) => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      dispatch(videoActions.setStream({ stream: currentStream }));
    } catch (err) {
      console.error(err);
    }
  };
};

export const answerCall = (socket_video) => {
  return async (dispatch, getState) => {
    const { _id } = getState().conversation.conversation;
    const { call, stream } = getState().video;
    const peer = new Peer({ initiator: false, trickle: false, stream: stream });

    dispatch(videoActions.setCallAccepted({ callAccepted: true }));

    peer.on("signal", (data) => {
      socket_video.emit("answer-call", { signal: data, conversationId: _id });
    });

    peer.on("stream", (currentStream) => {
      dispatch(videoActions.setUserStream({ userStream: currentStream }));
    });

    peer.signal(call.signal);

    dispatch(videoActions.setConnection({ connection: peer }));
  };
};

export const callUser = (socket_video) => {
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
      dispatch(videoActions.setUserStream({ userStream: currentStream }));
    });

    socket_video.on("accept-call", ({ signal }) => {
      dispatch(videoActions.setCallAccepted({ callAccepted: true }));
      peer.signal(signal);
    });

    dispatch(videoActions.setConnection({ connection: peer }));
  };
};

export const rejectCall = (navigate) => {
  return async (dispatch, getState) => {
    const { stream } = getState().video;
    stream?.getTracks().forEach(function (track) {
      track.stop();
    });
    // Becareful the order of navigate and dispatch
    navigate(`/home-chat`);

    // Must check again.
    // if (connection.current) {
    //   connection.current.destroy();
    // }
    // connection.current.on("close", () => {
    //   connection.current.destroy();
    // });
    dispatch(videoActions.setVideoState());
  };
};

// export const leaveCall = () => {
//   return (dispatch) => {
//     dispatch(videoActions.setCallEndded({ callEnded: true }));
//     window.location.reload();
//   };
// };
