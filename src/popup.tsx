import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ColorResult, SketchPicker } from 'react-color';

const Popup = () => {
  const [currentURL, setCurrentURL] = useState<string>();
  const [findColor, setFindColor] = useState('rgb(255, 224, 27)');
  const [replaceColor, setReplaceColor] = useState('');


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
            findColor,
            replaceColor,
          },
          (msg) => {
            console.log("result message:", msg);
            setFindColor(replaceColor);
          }
        );
      }
    });
  };

  const handleFindColorChangeComplete = (color: ColorResult, event: any) => {
    setFindColor(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
  };

  const handleReplaceColorChangeComplete = (color: ColorResult, event: any) => {
    setReplaceColor(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
  };

  return (
    <>
      <h3>Find Color</h3>
      <SketchPicker color={ findColor } onChangeComplete={ handleFindColorChangeComplete }/>
      <h3>Replace Color</h3>
      <SketchPicker color={ replaceColor } onChangeComplete={ handleReplaceColorChangeComplete }/>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
      </ul>
      <button onClick={changeBackground}>Find and Replace all background colors</button>
    </>
  );
};
const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );