import "./App.css";
import React from "react";
import UserDataContext from "./contexts/UserDataContext";
import MainPage from "./pages/MainPage";
import AddictionsContext from "./contexts/AddictionsContext";

function App() {

  return (
    <UserDataContext>
      <AddictionsContext>
        <MainPage />
      </AddictionsContext>
    </UserDataContext>
  );
}

export default App;
