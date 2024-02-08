import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import axios from 'axios'

export type Addiction = {
  siteUrl: string;
  time: number;
  count: number;
  dailyUsage: number;
};

export default function AddictionsContext({ children }: PropsWithChildren) {
  const [addictionList, setAddictionList] = useState<Addiction[]>([
    { siteUrl: "test1", time: 40, count: 6, dailyUsage: 60 },
    { siteUrl: "test2", time: 69, count: 9, dailyUsage: 90 },
  ]);
  const [streak, setStreak] = useState(0);

  const getAddictions = async () => {
    const url = "/limitations/";
    await axios.get(url).then((response) => {
      const data = response.data;
      data.map((item)=>{
              setAddictionList(addictionList => [...addictionList ,{
                siteUrl: item["name"],
                time: item["time"],
                count: item["count"],
                dailyUsage: item["daily_usage"],
              }]);

      })

      console.log(data);
    });
  };


  useEffect(() => {
    getAddictions();
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
  addictionList: [
    { siteUrl: "", time: 0, count: 0, dailyUsage: 0 },
  ],
  setAddictionList: (value: React.SetStateAction<Addiction[]>) =>
    console.log("userID set"),
  streak: 0,
  setStreak: (value: React.SetStateAction<number>) => console.log("streak set"),
});
