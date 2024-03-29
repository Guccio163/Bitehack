import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import MainPage from './pages/MainPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserDataContext from "./contexts/UserDataContext";
import AddictionsContext from "./contexts/AddictionsContext";
import axios from 'axios'
import LoginPage from './pages/LoginPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  }
]);

axios.defaults.baseURL = "http://127.0.0.1:8000/api";
// tymczasowy, to jest token zalogowanego ziomka
axios.defaults.headers.common["Authorization"] = `Token e31909e316ed96c159b39668941662bdc9d31786`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserDataContext>
      <AddictionsContext >
        <RouterProvider router={router} />
      </AddictionsContext>
    </UserDataContext>
  </React.StrictMode>
);


