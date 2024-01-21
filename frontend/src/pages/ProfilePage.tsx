import React, { useContext } from "react";
import { userDataContext } from "../contexts/UserDataContext";
import LoginPage from "./LoginPage";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";

export default function ProfilePage() {
  const { username, firstName, lastName } = useContext(userDataContext);
  return (
    <>
      <div style={{fontSize:200}}>
        <Person2RoundedIcon fontSize="large"/>
      </div>
      <label>
        {username}, {firstName}, {lastName}
      </label>
      <LoginPage></LoginPage>
    </>
  );
}
