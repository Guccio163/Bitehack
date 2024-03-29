import React, { useState } from "react";
import { Addiction } from "../contexts/AddictionsContext";
import axios from "axios";
import { Divider, ListItem, ListItemText } from "@mui/material";

interface Props {
  addiciton: Addiction;
}

function rgbToNumber(rgb: string) {
  return parseInt(rgb, 16);
}

function numberToRgb(number: number) {
    // console.log(number)
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

  // range 250-170 so -250 and *-1 to calculate to 0-100
  // red from 00 to ff
  // green from cc to ff


function translateToRGBGreenToYellow(percentage: number) {
  const normalized = (-1 * (percentage - 250)) / 80;
  const redRange = rgbToNumber("ff") - rgbToNumber("00");;
  const resultRed = numberToRgb(parseInt(`${redRange * normalized}`, 10));
  const greenRange = rgbToNumber("ff") - rgbToNumber("cc");
  const resultGreen = numberToRgb(
    parseInt(`${greenRange * normalized}`, 10) + rgbToNumber("cc")
  );
  return `#${resultRed}${resultGreen}00`;
}

  // range 170-90 so -170 and *-1 to calculate to 0-100
  // red from ff to cc
  // green from ff to 33


function translateToRGBYellowRed(percentage: number) {
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

function translatePercentageToRgb(percentage: number) {
  if (percentage > 170) {
    return translateToRGBGreenToYellow(percentage);
  } else {
    return translateToRGBYellowRed(percentage);
  }
}

// green: #00cc00
// yellow: #ffff00
// red: #cc3300

export default function AddictionPanel({ addiciton }: Props) {
  const [filling, setFilling] = useState(250);
  const [waterColour, setWaterColour] = useState(
    translatePercentageToRgb(filling)
  );
  const increaseFilling = () => {
    setFilling((filling) => filling - 2);
    setWaterColour(translatePercentageToRgb(filling));
    console.log(waterColour);
  };

  const dynamicStyles: string | number | string | {} = {
    "--fillVar": `${filling}%`,
    "background-color": `${waterColour}`,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        height: "10vh",
        width: "50vw",
        marginBottom: "10px",
        padding: "10px",
        justifyContent: "center",
      }}
    >
      <ListItem
        style={{
          display: "flex",
          flexDirection: "row",
          height: "10vh",
          width: "30vw",
          padding: "10px",
          justifyContent: "center",
          alignContent:" center",
          alignItems:"center",
          alignSelf:"center",

        }}
      >
        <div
          style={{
            marginRight: "10vw",
            fontWeight: "bold",
          }}
        >
          {addiciton.siteUrl}
        </div>
        <div
          style={{
            fontWeight: "bold",
            color: waterColour,
          }}
        >
          {(250 - filling) / 2}%
        </div>
        <div className="container">
          <div className="water" style={dynamicStyles} />
        </div>
        <button onClick={increaseFilling} color="primary" style={{marginLeft:"30px"}}>increase</button>
      </ListItem>
    </div>
  );
}
