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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserDataContext>
      <AddictionsContext>
        <RouterProvider router={router} />
      </AddictionsContext>
    </UserDataContext>
  </React.StrictMode>
);


