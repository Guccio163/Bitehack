import React, { useContext } from "react";
import { userDataContext } from "../contexts/UserDataContext";
import LoginPage from "./LoginPage";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

export default function ProfilePage() {
  const { username, firstName, lastName } = useContext(userDataContext);
  const navi = useNavigate();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: "0",
        top: "0",
        display: "flex",
        flexDirection: "column",
        padding: "1em 0 0 0",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
        }}
      >
        <button onClick={() => navi(-1)}>
          <HomeRoundedIcon />
        </button>
      </div>
      <div style={{ fontSize: "3.7rem" }}>Profil użytkownika</div>
      {username ? (
        <label>
          {username}, {firstName}, {lastName}
        </label>
      ) : (
        <Button onClick={() => navi("/login")} variant="contained">
          Zaloguj się
        </Button>
      )}
    </div>
  );
}
