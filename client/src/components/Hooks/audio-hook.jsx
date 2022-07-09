import React, { useState, useEffect } from "react";

export const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);
  console.log(playing);

  const toggle = async () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    if (playing) {
      audio.play();
      audio.loop = true;
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [playing]);

  return [playing, toggle];
};
