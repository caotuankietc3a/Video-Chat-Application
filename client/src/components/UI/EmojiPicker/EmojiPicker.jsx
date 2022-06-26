import React, { useEffect, useRef } from "react";
// https://github.com/missive/emoji-mart/blob/main/packages/emoji-mart/src/config.js
// https://github.com/missive/emoji-mart/tree/main/packages

import data from "@emoji-mart/data/sets/14/facebook.json";
import { Picker } from "emoji-mart";

function EmojiPicker(props) {
  const ref = useRef();

  useEffect(() => {
    new Picker({
      ...props,
      data,
      ref,
      theme: "dark",
      set: "facebook",
      searchPosition: "top",
      previewPosition: "bottom",
      navPosition: "bottom",
      perLine: "12",
    });
  }, []);

  return <div ref={ref} />;
}

export default EmojiPicker;
