import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg"
// import viteLogo from "../public/vite.svg"
import "./App.css";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";
import React from "react";

function App() {
  const [count, setCount] = useState(0);

  const alertItems = async () => {
    const querySnapshot = await getDocs(collection(firestore, "items"));
    querySnapshot.forEach((doc) => {
      alert(doc.data().papaj);
    });
  };

  // const vl = require("public/vite.svg") as string;
  // const rl = require("./assets/react.svg") as string;


  return (
    <>
      <div>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src={require(viteLogo)} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
            alertItems();
          }}
        >
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
