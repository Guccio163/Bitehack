import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

export type Addiction = {
  name: string;
  timeSpent: number;
};

export default function AddictionsContext({ children }: PropsWithChildren) {
  const [addictionList, setAddictionList] = useState<Addiction[]>([
    { name: "dupa", timeSpent: 40 },
    { name: "chuj", timeSpent: 69 },
  ]);


  useEffect(() => {
    console.log("context fetched addcitions");
  }, []);

  return (
    <addictionsContext.Provider
      value={{
        addictionList: addictionList,
        setAddictionList: setAddictionList,
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
});
