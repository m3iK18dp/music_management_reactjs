import { useState, useEffect } from "react";
import playlistService from "../services/PlayListService";
import CustomButton from "./CustomButton";

import { IoMdAdd } from "react-icons/io";
import { BiUpArrow } from "react-icons/bi";
const CustomContextMenu = ({ x, y, id, playlists, setPlaylists, navigate }) => {
  console.log(x, y);
  const [showFormAddPlaylist, setShowFormAddPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState({ name: "" });
  const show = {
    x: x + 228 > window.innerWidth ? x - 228 : x,
    y: y + 100 > window.innerHeight ? y - 76 : y,
  };
  const set = (prop, value) => {
    setPlaylist({ ...playlist, [prop]: value });
  };
  const get = (field) => {
    return playlist[field];
  };
  // const [windowSize, setWindowSize] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });

  // useEffect(() => {
  //   if (x + 228 > windowSize.width)
  //     setShow({
  //       x: ,
  //       y: y,
  //     });
  //   if (y + 156 > windowSize.height)
  //     setShow({
  //       x: x,
  //       y: y - 156,
  //     });
  //   function handleResize() {
  //     setWindowSize({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   }

  //   window.addEventListener("resize", handleResize);
  //   console.log(windowSize);

  //   // Clean up listener when component unmounts
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);
  const addPlaylist = () => {
    playlistService.insertPlaylist(playlist, navigate).then((res) => {
      if (res.status === "ok") {
        setPlaylists([...playlists, res.data]);
        alert("Add playlist success.");
      } else alert("Add playlist Failed.");
    });
  };
  const addSongToPlaylist = (playlistId) => {
    playlistService.addSongToPlayList(playlistId, id, navigate).then((res) => {
      if (res.status === "ok") {
        // setPlaylists([...playlists, res.data]);
        alert("Add song to playlist success.");
      } else alert("Add song to playlist Failed.");
    });
  };
  const deleteSongInPlaylist = (playlistId) => {
    playlistService
      .deleteSongInPlaylist(playlistId, id, navigate)
      .then((res) => {
        if (res.status === "ok") {
          // setPlaylists([...playlists, res.data]);
          alert("Delete song in this playlist success.");
        } else alert("Delete song in this playlist Failed.");
      });
  };
  return (
    <div
      style={{
        position: "absolute",
        left: show.x,
        top: show.y,
        backgroundColor: "rgba(0,0,0,0.5)",
        border: "1px solid purple",
        padding: "10px",
        zIndex: 1000,
        color: "white",
      }}
    >
      {/* <div>
        <p>Window width: {windowSize.width}</p>
        <p>Window height: {windowSize.height}</p>
      </div> */}
      <div
        onMouseOver={(e) => {
          e.target.style.cursor = "pointer";
          document.getElementById(`list-playlist`).style.display = "block";
        }}
        style={{
          borderBottom: "1px solid rgba(255, 255, 255,0.5)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <h6 style={{ marginBottom: 0 }}>Add Song to Playlist</h6>
        <BiUpArrow></BiUpArrow>
      </div>
      {window.location.pathname.includes("my_playlist") && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            const playlistIdInPath = window.location.pathname.split("/");
            deleteSongInPlaylist(playlistIdInPath[playlistIdInPath.length - 1]);
          }}
          style={{ borderBottom: "1px solid rgba(255, 255, 255,0.5)" }}
          onMouseOver={(event) => {
            event.target.style.cursor = "pointer";
            document.getElementById(`list-playlist`).style.display = "none";
          }}
        >
          <h6 style={{ marginBottom: 0 }}> Delete Song in this Playlist</h6>
        </div>
      )}

      <div
        id="list-playlist"
        style={{
          position: "absolute",
          top: 0,
          left: 250,
          padding: 10,

          // marginTop: "-270px",
          // marginLeft: "100px",
          //   top: y,
          backgroundColor: "rgba(0,0,0,0.5)",
          border: "1px solid purple",
          display: "none",
          zIndex: 10001,
          color: "white",
          width: 150,
          overflow: "auto",
        }}
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
            setShowFormAddPlaylist(!showFormAddPlaylist);
          }}
          onMouseOver={(event) => {
            event.target.style.cursor = "pointer";
          }}
          style={{
            borderBottom: "1px solid rgba(255,255,255,1)",
            marginBottom: 10,
          }}
        >
          Add Playlist
          <IoMdAdd></IoMdAdd>
        </div>
        {showFormAddPlaylist && (
          <div style={{ display: "flex", marginBottom: 15 }}>
            {/* <CustomInput
              field="Name"
              set={set}
              get={get}
              style={{ width: "100%" }}
              func={addPlaylist}
            ></CustomInput> */}

            <label>Name:</label>

            <input
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                // event.stopPropagation();
                set("name", event.target.value);
              }}
              style={{ width: "100%" }}
              value={get("name")}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addPlaylist();
                }
              }}
            ></input>

            <CustomButton
              IconButton={IoMdAdd}
              func={addPlaylist}
              size={20}
              id="add-playlist"
            />
          </div>
        )}
        {playlists.map((playlist) => (
          // <>
          <div
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.6)",
              marginBottom: 10,
            }}
            key={"context-playlist-" + playlist.id}
            onClick={() => {
              addSongToPlaylist(playlist.id);
            }}
            onMouseOver={(e) => {
              e.target.style.cursor = "pointer";
            }}
          >
            <h6 style={{ marginBottom: 0 }}>{playlist.name}</h6>
          </div>
          //  <CustomButton
          //   field={playlist.id}
          //   IconButton={AiOutlineDelete}
          //   func={deletePlaylist}
          //   size={15}
          //   id={`delete-playlist-${playlist.id}`}
          // />
          // </>
        ))}
      </div>
    </div>
  );
};
export default CustomContextMenu;
