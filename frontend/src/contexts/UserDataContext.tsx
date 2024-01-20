import React, { PropsWithChildren, createContext, useEffect, useState } from 'react'

export default function UserDataContext({children}: PropsWithChildren) {
    const [userID, setUserID] = useState("");

    useEffect(() => {
      console.log("context fetched data")
    }, []);


    return (
    <userDataContext.Provider
      value={{
        userID: userID,
        setUserID: setUserID,
      }}
    >
      {children}
    </userDataContext.Provider>
  )
}

export const userDataContext = createContext({
  userID: "xd",
  setUserID: (value: React.SetStateAction<string>) => console.log("userID set"),
});

