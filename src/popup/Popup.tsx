import React, { useEffect } from "react";
import "./Popup.scss";

export default function Popup() {
  useEffect(() => {
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

  return <div className="popupContainer">Hello world!</div>;
}
