import React, { useContext } from "react";
import { userDataContext } from "../contexts/UserDataContext";

export default function ProfilePage() {
  const { username, firstName, lastName } = useContext(userDataContext);
  return (
    <>
      <div>ProfilePage</div>
      <label>
        {username}, {firstName}, {lastName}
      </label>
    </>
  );
}
