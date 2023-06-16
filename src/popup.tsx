import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ColorResult, SketchPicker } from 'react-color';
import hexRgb from 'hex-rgb';

const Popup = () => {
  const [findColor, setFindColor] = useState('');
  const [replaceColor, setReplaceColor] = useState('');
  const [designMode, setDesignMode] = useState('off');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        if (tab.id) {
          chrome.tabs.sendMessage(
            tab.id,
            {
              getDesignMode: true,
            },
            (msg) => {
              console.log("result message:", msg);
              setDesignMode(msg.existingDesignMode);
            }
          );
        }
      });
  });

  const startEyeDropper = async () => {
    const eyeDropper = new window.EyeDropper();
    try {
        const result: {sRGBHex: string} = await eyeDropper.open(); //doesn't get accurate colors on my main monitor
        console.log(result);
        const rgb = hexRgb(result.sRGBHex);
        console.log(rgb);
        const rgbString = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
        console.log(rgbString);
        setFindColor(rgbString);
    } catch (err) {
        console.log(err)
    }
  };

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

  const sendDesignMode = (mode: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        if (tab.id) {
          chrome.tabs.sendMessage(
            tab.id,
            {
              designMode: mode
            },
            (msg) => {
              console.log("result message:", msg);
              setDesignMode(msg.designMode);
            }
          );
        }
      });
  };

  const onToggleTextEditMode = (event: any) => {
    if (event.target.checked) {
        sendDesignMode('on');
    } else {
        sendDesignMode('off');
    }
  };

  const buttonStyle = {
    marginBottom: "12px",
    cursor: "pointer",
    height: "40px",
    width: "150px",
  };

  const areaStyle = {
    margin: "10px",
    border: "solid grey",
    borderRadius: "5px",
    padding: "10px",
  };

  return (
    <>
        <div style={{ display: "flex", marginBottom: "12px" }}>
            <div style={areaStyle}>
                <h3>Find Color</h3>
                <button style={{...buttonStyle, width: "100%"}} onClick={startEyeDropper}>Pick Color From Page</button>
                <SketchPicker color={ findColor } onChangeComplete={ handleFindColorChangeComplete }/>
            </div>
            <div style={areaStyle}>
                <h3>Replace Color</h3>
                <div style={{ height: "52px" }}/>
                <SketchPicker color={ replaceColor } onChangeComplete={ handleReplaceColorChangeComplete }/>
            </div>
        </div>
        <button style={{...buttonStyle, width: "80%", marginLeft: "10px"}} onClick={changeBackground}>Find and Replace all element colors</button>
        <div style={{ marginLeft: "7px" }}>
            <input checked={designMode == 'on' ? true : false} type="checkbox" onChange={onToggleTextEditMode} />
            <label style={{ fontSize: "20px" }}>Text Edit Mode</label>
        </div>
    </>
  );
};
const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );