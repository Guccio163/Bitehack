import React, { useContext, useState } from "react";
import AddictionPanel from "../components/AddictionPanel";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { addictionsContext } from "../contexts/AddictionsContext";
import { useNavigate } from "react-router-dom";
import { List } from "@mui/material";

export default function MainPage() {


  const { addictionList, setAddictionList } = useContext(addictionsContext);
  const navi = useNavigate();


  return (
    <>
      <button
        style={{ position: "absolute", top: "2vh", left: "2vw" }}
        onClick={() => navi("/settings")}
      >
        ustawienia
      </button>
      <button
        style={{ position: "absolute", top: "2vh", right: "2vw" }}
        onClick={() => navi("/profile")}
      >
        profil
      </button>
      <h1>Hehe tytuł do strony</h1>
      <List sx={{alignContent:"center", alignSelf:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
        {addictionList.map((item) => (
          <AddictionPanel addiciton={item} />
        ))}
      </List>
    </>
  );
}
