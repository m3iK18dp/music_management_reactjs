import ReactDOM from "react-dom/client";
import "./css/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./page/App";
import Login from "./page/Login";
import Register from "./page/Register";
import Songs from "./page/Songs";
import MyAccount from "./page/MyAccount";
import Users from "./page/Users";
import ErrorPage from "./page/ErrorPage";
import UploadUser from "./page/UploadUser";
import UploadSong from "./page/UploadSong";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/songs" element={<Songs />} />
      <Route
        path="/my_songs"
        element={
          localStorage.getItem("token") ? <Songs /> : <ErrorPage code={403} />
        }
      />
      <Route
        path="/my_playlist/:playlist_id"
        element={
          localStorage.getItem("token") ? <Songs /> : <ErrorPage code={403} />
        }
      />
      <Route
        path="/songs/:id"
        element={
          localStorage.getItem("token") ? (
            <UploadSong />
          ) : (
            <ErrorPage code={403} />
          )
        }
      />

      <Route
        path="/users"
        element={
          localStorage.getItem("token") ? <Users /> : <ErrorPage code={403} />
        }
      />
      <Route
        path="/users/:id"
        element={
          localStorage.getItem("token") ? (
            <UploadUser />
          ) : (
            <ErrorPage code={403} />
          )
        }
      />
      <Route
        path="/account/:username"
        element={
          !localStorage.getItem("token") ? (
            <ErrorPage code={403} />
          ) : (
            <MyAccount />
          )
        }
      />
      <Route path="*" element={<ErrorPage code={404} />} />
      <Route path="/error/:code" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);
