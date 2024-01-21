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
    { siteUrl: "dupa", time: 40, count: 6, dailyUsage: 60 },
    { siteUrl: "chuj", time: 69, count: 9, dailyUsage: 90 },
  ]);
  const [streak, setStreak] = useState(0);

  const getAddictions = async () => {
    const url = "/limitations/";
    const model = {
      site_url: "https://opera.com/",
      time: 60,
      count: 20,
      daily_usage: 0,
    };
    await axios.post(url, model).then((response) => {
      const data = response.data;
      data.map((item)=>{
              setAddictionList(addictionList => [...addictionList ,{
                siteUrl: item["site_url"],
                time: item["time"],
                count: item["count"],
                dailyUsage: item["daily_usage"],
              }]);

      })
      // setAddictionList({siteUrl: data["site_url"], time: data["time"], count: data["count"], dailyUsage: data["daily_usage"]})
      // setUserID(data["site_url"]);
      // setUsername(data["time"]);
      // setFirstName(data["count"]);
      // setLastName(data["daily_usage"]);

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
