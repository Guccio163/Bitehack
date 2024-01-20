import React, { useState } from "react";
import { Addiction } from "../contexts/AddictionsContext";
import axios from 'axios'

interface Props {
  addiciton: Addiction;
}

export default function AddictionPanel({ addiciton }: Props) {
  const [filling, setFilling] = useState(160)
    const increaseFilling = ()=>{
        setFilling(filling=>filling-20)
  }

   const dynamicStyles: string | number| string | {} = {
     "--fillVar": `${filling}%`, // Ustaw kolor na czerwony lub inny, zależnie od warunków
   };

    return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "red",
        width: "50vw",
        alignItems: "center",
        placeContent: "center",
        alignSelf: "center",
      }}
    >
      <div style={{ marginRight: "15vw", backgroundColor: "green" }}>
        {addiciton.name} : {addiciton.timeSpent}
      </div>
      <div className="container" style={{ backgroundColor: "yellow" }}>
        <div className="water" style={dynamicStyles}/>
      </div>
      <button onClick={increaseFilling}>
        dupa
      </button>
    </div>
  );
}
