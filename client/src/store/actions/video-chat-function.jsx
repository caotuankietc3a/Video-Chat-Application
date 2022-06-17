import Peer from "simple-peer";
import { videoActions } from "../slices/video-chat-slice";

const connectionCallHandler = (navigate, conversation) => {
  return async (dispatch, getState) => {
    const { user } = getState().user;
    const { socket_video } = getState().socket;
    socket_video.emit(
      "make-connection-call",
      { conversationId: conversation._id, caller: user },
      (callee) => {
        dispatch(
          videoActions.setCall({
            call: {
              isReceivedCall: false,
              caller: user,
              callee: callee,
            },
          })
        );
      }
    );

    setTimeout(() => {
      navigate(`/home-chat/meetings/${conversation._id}`);
    }, 500);
  };
};

export const videoStreamStart = (navigate, conversation, type = false) => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().user;
      const member = conversation.members.find(
        (member) => member._id !== user._id
      );
      if (!member.status) {
        return dispatch(
          videoActions.setError({
            error: {
              text: "Can't call user because user is offline",
            },
          })
        );
      }
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      dispatch(videoActions.setStream({ stream: currentStream }));
      if (type === true) {
        dispatch(connectionCallHandler(navigate, conversation));
      }
    } catch (err) {
      dispatch(
        videoActions.setError({
          error: {
            text: "Please activate microphone to make calls!!!",
          },
        })
      );
      console.error(err);
    }
  };
};

export const answerCall = (socket_video, hasVideo = false) => {
  return async (dispatch, getState) => {
    try {
      const { _id } = getState().conversation.conversation;
      const { call, stream } = getState().video;
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      dispatch(videoActions.setCallAccepted({ callAccepted: true }));
      if (hasVideo) dispatch(videoActions.setShowVideo({ showVideo: true }));

      peer.on("signal", (data) => {
        socket_video.emit("answer-call", {
          signal: data,
          conversationId: _id,
          hasVideo,
        });
      });

      peer.on("stream", (currentStream) => {
        dispatch(videoActions.setUserStream({ userStream: currentStream }));
      });

      peer.signal(call.signal);
      dispatch(videoActions.setConnection({ connection: peer }));
    } catch (err) {
      console.error(err);
    }
  };
};

export const callUser = () => {
  return (dispatch, getState) => {
    try {
      const { stream } = getState().video;
      const { socket_video } = getState().socket;
      const { _id } = getState().conversation.conversation;
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      // set showVideo to caller (default)
      dispatch(videoActions.setShowVideo({ showVideo: false }));

      peer.on("signal", (data) => {
        socket_video.emit("call-user", {
          conversationId: _id,
          signal: data,
        });
      });

      peer.on("stream", (currentStream) => {
        dispatch(videoActions.setUserStream({ userStream: currentStream }));
      });

      socket_video.on("accept-call", ({ signal, hasUserVideo }) => {
        dispatch(videoActions.setCallAccepted({ callAccepted: true }));
        // set showUserVideo to caller if they accept video call.
        if (hasUserVideo)
          dispatch(videoActions.setShowUserVideo({ showUserVideo: true }));
        peer.signal(signal);
      });

      dispatch(videoActions.setConnection({ connection: peer }));
    } catch (err) {
      console.error(err);
    }
  };
};

export const rejectCall = (navigate) => {
  return async (dispatch, getState) => {
    try {
      const { stream, userStream, connection } = getState().video;
      stream?.getTracks().forEach(function (track) {
        track.stop();
      });
      userStream?.getTracks().forEach(function (track) {
        track.stop();
      });
      // connection._destroy();
      // console.log(connection);

      // Becareful the order of navigate and dispatch
      navigate(`/home-chat`);
      dispatch(videoActions.setVideoState());
      // window.location.reload();

      // Must check again. Cannot use peer.destroy().
      // if (connection.current) {
      // }
      // connection.current.on("close", () => {
      //   connection.current.destroy();
      // });
    } catch (err) {}
  };
};

export const leaveMeetingRoom = (navigate) => {
  return (dispatch) => {
    dispatch(rejectCall(navigate));
    window.location.reload();
  };
};

export const shareScreen = () => {
  return async (_dispatch, getState) => {
    try {
      const { stream, connection } = getState().video;
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        cursor: true,
      });
      const screenTrack = screenStream.getTracks()[0];
      const videoTrack = stream
        ?.getTracks()
        .find((track) => track.kind === "video");

      // Ended screen on google and brave
      screenTrack.onended = (e) => {
        connection.replaceTrack(e.target, videoTrack, stream);
      };
      connection.replaceTrack(videoTrack, screenTrack, stream);
    } catch (err) {
      console.error(err);
    }
  };
};
