import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ColorResult, SketchPicker } from 'react-color';

const Popup = () => {
  const [currentURL, setCurrentURL] = useState<string>();
  const [color, setColor] = useState('');


  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color,
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  const handleChangeComplete = (color: ColorResult, event: any) => {
    setColor(color.hex);
  };

  return (
    <>
      <SketchPicker color={ color } onChangeComplete={ handleChangeComplete }/>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
      </ul>
      <button onClick={changeBackground}>change background</button>
    </>
  );
};
const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );