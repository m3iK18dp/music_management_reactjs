import { useState, useEffect } from "react";
import playlistService from "../services/PlayListService";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

import { IoMdAdd } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { Row, Col } from "react-bootstrap";
// const AddSongToPlayListContextMenu = ({ x, y, id, navigate }) => {
//   console.log(id);
//   const handleAddSongToPlayList = () => {
//     playlistService
//       .addSongToPlayList(1, id, navigate)
//       .then((data) => console.log(data.data));
//   };
//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: x,
//         top: y,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         // border: '1px solid purple',
//         padding: "10px",
//         zIndex: 1000,
//         color: "white",
//       }}
//     >
//       {/* <div
// 				onClick={() => navigate('/songs')}
// 				style={{ backgroundColor: 'yellow' }}
// 			>
// 				Songs
// 			</div>
// 			<div
// 				onClick={() => navigate('/songs')}
// 				style={{ backgroundColor: 'green' }}
// 			>
// 				Users
// 			</div> */}
//       <div
//         onClick={handleAddSongToPlayList}
//         style={{ borderBottom: "1px solid rgba(255, 255, 255,0.5)" }}
//       >
//         Add Song to Playlist 1
//       </div>
//     </div>
//   );
// };
const CustomContextMenu = ({ x, y, id, playlists, setPlaylists, navigate }) => {
  const [showFormAddPlaylist, setShowFormAddPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState({ name: "" });
  const set = (field, value) => {
    setPlaylist({ ...{}, field: value });
  };
  const get = (field) => {
    return playlist[field];
  };
  // useEffect(() => {
  //   playlistService.get({}, navigate).then((res) => {
  //     setPlaylists(res.data.content);
  //   });
  // }, []);
  const addPlaylist = () => {
    playlistService.insertPlaylist(playlist, navigate).then((res) => {
      if (res.status === "ok") alert("Add playlist success.");
      else alert("Add playlist Failed.");
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        backgroundColor: "rgba(0,0,0,0.5)",
        // border: '1px solid purple',
        padding: "10px",
        zIndex: 1000,
        color: "white",
      }}
    >
      <div
        // onClick={(event) => handleContextMenu(event, id)}
        onMouseOver={(e) => {
          e.target.style.cursor = "pointer";
          document.getElementById(`list-playlist`).style.display = "block";
        }}
        // onMouseOut={(e) => {
        //   document.getElementById(`list-playlist`).style.display = "none";
        // }}
        style={{ borderBottom: "1px solid rgba(255, 255, 255,0.5)" }}
      >
        Add Song to Playlist
      </div>
      <div
        id="list-playlist"
        style={{
          position: "absolute",
          marginLeft: 150,
          padding: 10,
          //   top: y,
          backgroundColor: "rgba(0,0,0,0.5)",
          // border: '1px solid purple',
          display: "none",
          zIndex: 10001,
          color: "white",
          width: 150,
          overflow: "hidden",
        }}
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
            setShowFormAddPlaylist(!showFormAddPlaylist);
          }}
        >
          Add Playlist
        </div>
        {showFormAddPlaylist && (
          <>
            <CustomInput
              field="Name"
              set={set}
              get={get}
              style={{ width: "100%" }}
              func={addPlaylist}
            ></CustomInput>
            <CustomButton
              IconButton={IoMdAdd}
              func={addPlaylist}
              size={20}
              id="add-playlist"
            />
          </>
        )}
        {playlists.map((playlist) => (
          // <>
          <div key={"context-playlist-" + playlist.id}>{playlist.name}</div>
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
