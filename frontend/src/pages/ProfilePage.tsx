import React, { useContext } from "react";
import { userDataContext } from "../contexts/UserDataContext";
import LoginPage from "./LoginPage"

export default function ProfilePage() {
  const { username, firstName, lastName } = useContext(userDataContext);
  return (
    <>
      <div style={{
        width:"100vw", 
        height:"10vh", 
        position:"absolute", 
        left: "0", top:"0", 
        display:"flex", 
        flexDirection:"column",
        padding:"1em 0 0 0"
      }}>
        <div style={{fontSize:"3.7rem"}}>Profil użytkownika</div>
        <label>
          {username}, {firstName}, {lastName}
        </label>
      </div>
      <LoginPage></LoginPage>
    </>
  );
}
