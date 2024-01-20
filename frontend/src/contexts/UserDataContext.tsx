import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

export default function UserDataContext({ children }: PropsWithChildren) {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const getAddictions = () => {
    console.log("fetching addictions from db");
  };

  useEffect(() => {
    if (userID) {
        getAddictions();
    }
    console.log("context fetched data");
  }, []);

  return (
    <userDataContext.Provider
      value={{
        userID: userID,
        setUserID: setUserID,
        username:username,
        setUsername:setUsername,
        firstName:firstName,
        setFirstName: setFirstName,
        lastName:lastName,
        setLastName: setLastName,
      }}
    >
      {children}
    </userDataContext.Provider>
  );
}

export const userDataContext = createContext({
  userID: "",
  setUserID: (value: React.SetStateAction<string>) => console.log("userID set"),
  username: "",
  setUsername: (value: React.SetStateAction<string>) =>
    console.log("userID set"),
  firstName: "",
  setFirstName: (value: React.SetStateAction<string>) =>
    console.log("userID set"),
  lastName: "",
  setLastName: (value: React.SetStateAction<string>) =>
    console.log("userID set"),
});
