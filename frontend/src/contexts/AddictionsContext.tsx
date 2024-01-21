import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import axios from 'axios'

export type Addiction = {
  name: string;
  timeSpent: number;
};

export default function AddictionsContext({ children }: PropsWithChildren) {
  const [addictionList, setAddictionList] = useState<Addiction[]>([
    { name: "dupa", timeSpent: 40 },
    { name: "chuj", timeSpent: 69 },
  ]);
  const [streak, setStreak] = useState(0);


  useEffect(() => {

    console.log("context fetched addcitions");
    console.log("context fetched streak")
  }, []);

  return (
    <addictionsContext.Provider
      value={{
        addictionList: addictionList,
        setAddictionList: setAddictionList,
        streak: streak,
        setStreak: setStreak
      }}
    >
      {children}
    </addictionsContext.Provider>
  );
}

export const addictionsContext = createContext({
  addictionList: [{ name: "", timeSpent: 0 }],
  setAddictionList: (value: React.SetStateAction<Addiction[]>) =>
    console.log("userID set"),
  streak: 0,
  setStreak: (value: React.SetStateAction<number>) =>
    console.log("streak set"),
});
