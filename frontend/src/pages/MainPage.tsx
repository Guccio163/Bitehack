import React, { useContext, useState } from "react";
import AddictionPanel from "../components/AddictionPanel";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { addictionsContext } from "../contexts/AddictionsContext";
import { useNavigate } from "react-router-dom";
import { List } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";


export default function MainPage() {


  const { addictionList, streak } = useContext(addictionsContext);
  const navi = useNavigate();


  return (
    <>
      <button
        style={{ position: "absolute", top: "2vh", left: "2vw" }}
        onClick={() => navi("/settings")}
      >
        <SubscriptionsIcon />
      </button>
      <button
        style={{ position: "absolute", top: "2vh", right: "2vw" }}
        onClick={() => navi("/profile")}
      >
        <PersonIcon fontSize="medium" />
      </button>
      <h1>
        Congratulations, it's day{" "}
        <span style={{ color: "gold", textShadow: "0 0 4px goldenrod" }}>
          {" "}
          {streak}
        </span>
        !
      </h1>
      <List
        sx={{
          alignContent: "center",
          alignSelf: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {addictionList.map((item) => (
          <AddictionPanel addiciton={item} />
        ))}
      </List>
    </>
  );
}
