import React from 'react';
import './App.css';
import { DOMMessage, LimitationRecord } from './types';

function rgbToNumber(rgb: string) {
  return parseInt(rgb, 16);
}

function numberToRgb(number: number) {
  const result = number.toString(16);
  if (result.length == 1) {
    if (number < 16) {
      return `0${result}`;
    } else {
      return `${result}0`;
    }
  } else {
    return result;
  }
}

function translateToRGBGreenToYellow(percentage: number): string {
  const normalized = (-1 * (percentage - 250)) / 80;
  const redRange = rgbToNumber("ff") - rgbToNumber("00");;
  const resultRed = numberToRgb(parseInt(`${redRange * normalized}`, 10));
  const greenRange = rgbToNumber("ff") - rgbToNumber("cc");
  const resultGreen = numberToRgb(
    parseInt(`${greenRange * normalized}`, 10) + rgbToNumber("cc")
  );
  return `#${resultRed}${resultGreen}00`;
}

function translateToRGBYellowRed(percentage: number): string {
  const normalized = (-1 * (percentage - 170)) / 80;
  const redRange = rgbToNumber("ff") - rgbToNumber("cc");
  const resultRed = numberToRgb(
    parseInt(`${redRange * (1 - normalized)}`, 10) + rgbToNumber("cc")
  );
  const greenRange = rgbToNumber("ff") - rgbToNumber("33");
  const resultGreen = numberToRgb(
    parseInt(`${greenRange * (1 - normalized)}`, 10) + rgbToNumber("33")
  );
  return `#${resultRed}${resultGreen}00`;
}

function translatePercentageToRgb(percentage: number): string {
  if (percentage > 170) {
    return translateToRGBGreenToYellow(percentage);
  } else {
    return translateToRGBYellowRed(percentage);
  }
}

function App() {
  const [dataRecord, setDataRecord] = React.useState<LimitationRecord>({
    name: "www.google.com",
    data: {
      count: 2,
      daily_usage: 90,
      time: 3600
    }
  });
  const [filling, setFilling] = React.useState<number>(250);
  const [waterColour, setWaterColour] = React.useState<string>(
    translatePercentageToRgb(filling)
  );

  React.useEffect(() => {
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { message: "get-domain" } as DOMMessage,
        (res: DOMMessage) => {
          setDataRecord({
            name: res.message,
            data: {
              count: 3,
              daily_usage: 11,
              time: 360,
            }
          })
          setFilling(250 - ((250 - 90) / 100) * Math.round((dataRecord.data.time * 100) / (dataRecord.data.daily_usage * 60)))
          setWaterColour(translatePercentageToRgb(filling))
        });
    });
  }, []);

  const dynamicStyles: string | number | string | {} = {
    "--fillVar": `${filling}%`,
    "background-color": `${waterColour}`,
  };

  return (
    <div className="App">
      <div className='quick-display'>
        <h3>{dataRecord.name}</h3>
        <span>visits: {dataRecord.data.count}</span>
        <div className="container">
          <div className="water" style={dynamicStyles} />
        </div>
        <span>{Math.round((dataRecord.data.time * 100) / (dataRecord.data.daily_usage * 60))}%</span>
      </div>
    </div>
  );
}

export default App;
