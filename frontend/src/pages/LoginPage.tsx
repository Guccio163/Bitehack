import React, { useContext, useState } from "react";
import axios from "axios";
import { userDataContext } from "../contexts/UserDataContext";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function LoginPage() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navi = useNavigate();

  const { setFirstName, setLastName, setUsername, setUserID } =
    useContext(userDataContext);
  const logToServer = async () => {
    const url = "/login/";
    const model = { username: loginUsername, password: loginPassword };
    await axios.post(url, model).then((response) => {
      const data = response.data;
      setUserID(data["token"]);
      setUsername(data["username"]);
      setFirstName(data["first_name"]);
      setLastName(data["last_name"]);

      console.log(data);
    });
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
        }}
      >
        <button onClick={() => navi(-1)}>
          <ArrowBackIcon />
        </button>
      </div>
      <div style={{ padding: "0 0 3rem 0", fontSize: "32px" }}>Login Page</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridRowGap: "1.5em",
          fontSize: "20px",
        }}
      >
        <label style={{ gridColumn: "1", gridRow: "1" }}>Username</label>
        <input
          style={{ gridColumn: "2", gridRow: "1", fontSize: "1.4em" }}
          type="text"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <label style={{ gridColumn: "1", gridRow: "2" }}>Password</label>
        <input
          style={{ gridColumn: "2", gridRow: "2", fontSize: "1.4em" }}
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button style={{ gridColumn: "2", gridRow: "3" }} onClick={logToServer}>
          Log in
        </button>
      </div>
    </>
  );
}
