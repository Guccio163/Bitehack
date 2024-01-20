import React, { useContext, useState } from "react";
import axios from "axios";
import { userDataContext } from "../contexts/UserDataContext";
export default function LoginPage() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { setFirstName, setLastName, setUsername, setUserID } =
    useContext(userDataContext);
  // token, username, first_name, last_name
  const logToServer = async () => {
    const url = "/login/";
    const model = { username: loginUsername, password: loginPassword };
    await axios.post(url, model).then((response) => {
      const data = response.data;
      setUserID(data("token"));
      setUsername(data("username"));
      setFirstName(data("first_name"));
      setLastName(data("last_name"));
    });
  };

  return (
    <>
      <div>LoginPage</div>
      <label>
        Username:
        <input
          type="text"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
      </label>
      <button onClick={logToServer}>log</button>
    </>
  );
}
