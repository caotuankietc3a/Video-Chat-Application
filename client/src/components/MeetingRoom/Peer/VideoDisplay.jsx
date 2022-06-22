import { useEffect, useRef } from "react";

const VideoDisplay = ({ peer, stream }) => {
  const userVideo = useRef();

  useEffect(() => {
    userVideo.current.srcObject = stream;

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
  }, [stream]);

  return <video playsInline autoPlay ref={userVideo} />;
};

export default VideoDisplay;
