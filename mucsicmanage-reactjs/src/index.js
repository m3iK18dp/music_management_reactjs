import React from "react";
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
import AudioPlayer from "./components/AudioPlayer";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/songs" element={<Songs />} />
      <Route path="/songs/:id" element={<UploadSong />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UploadUser />} />{" "}
      <Route path="/account/:username" element={<MyAccount />} />
      <Route
        path="/test"
        element={
          <AudioPlayer
            songs={[
              {
                id: 6,
                title: "1 Phút",
                musician: "Andiez",
                genre: "",
                lastUpdate: "2023-03-28T20:41:23.659654",
                url: "https://res.cloudinary.com/dx2nrp7at/video/upload/v1680010902/MusicManager/edfd79de-25b7-4c43-8936-26722d60f213.mp3",
              },
              {
                id: 1,
                title: "3107 4 - Wn x Erik ft Nâu",
                musician: "Erik",
                genre: "VPOP",
                lastUpdate: "2023-04-02T16:06:01.110308",
                url: "https://res.cloudinary.com/dx2nrp7at/video/upload/v1680426383/MusicManager/tmjgp5q4ytjtcwl3uzgu.mp3",
              },
              {
                id: 11,
                title: "Không Thể Cùng Nhau Suốt Kiếp",
                musician: "Mr.Siro",
                genre: "Sad Song",
                lastUpdate: "2023-04-02T01:31:24.279194",
                url: "https://res.cloudinary.com/dx2nrp7at/video/upload/v1680373906/MusicManager/6db0f51a-6311-4f8f-b05c-6cc49ac7aaa6.mp3.mp3.mp3",
              },
              {
                id: 5,
                title: "Lạ Lùng - Vũ",
                musician: "Vũ",
                genre: "VPOP",
                lastUpdate: "2023-03-15T23:08:11.135838",
                url: "https://res.cloudinary.com/dx2nrp7at/video/upload/v1678896498/MusicManager/b3ec22af-0997-466e-8bc3-b4c525320b09.mp3",
              },
            ]}
          />
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);
