import React, { useContext, useState } from "react";
import AddictionPanel from "../components/AddictionPanel";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { addictionsContext } from "../contexts/AddictionsContext";

export default function MainPage() {


  const { addictionList, setAddictionList } = useContext(addictionsContext);

  return (
    <>
      <button style={{ position: "absolute", top: "2vh", left: "2vw" }}>
        ustawienia
      </button>
      <button style={{ position: "absolute", top: "2vh", right: "2vw" }}>
        profil
      </button>
      <button style={{ position: "absolute", top: "2vh", left: "2vw" }}>
        ustawienia
      </button>
      <h1>Hehe tytuł do strony</h1>
      <div>
        {addictionList.map((item) => (
          <AddictionPanel addiciton={item} />
        ))}
      </div>
    </>
  );
}
