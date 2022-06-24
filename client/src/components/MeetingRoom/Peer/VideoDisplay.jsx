import { useEffect, useRef } from "react";

const VideoDisplay = ({ stream, muted, hidden }) => {
  const userVideo = useRef();

  useEffect(() => {
    userVideo.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      playsInline
      autoPlay
      ref={userVideo}
      muted={muted}
      style={{
        width: hidden ? "0px" : "100%",
        height: hidden ? "0px" : "100%",
      }}
      controls="controls"
    />
  );
};

export default VideoDisplay;
