import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./page/App";
import Login from "./page/Login";
import Register from "./page/Register";
import Songs from "./page/Songs";
import UpdateSong from "./page/UpdateSong";
import Logout from "./page/Logout";
import MyAccount from "./page/MyAccount";
import Users from "./page/Users";
import UpdateUser from "./page/UpdateUser";
import ErrorPage from "./page/ErrorPage";
import NewSong from "./page/NewSong";
import NewUser from "./page/NewUser";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />} />
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/songs" element={<Songs />} />
      <Route path="/songs/new" element={<NewSong />} />
      <Route path="/songs/:_id" element={<UpdateSong />} />
      <Route path="/account/:username" element={<MyAccount />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/new" element={<NewUser />} />
      <Route path="/users/id" element={<UpdateUser />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);
