import { useState } from "react";
import playlistService from "../services/PlayListService";
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
const CustomContextMenu = ({ x, y, id, navigate }) => {
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
          //   top: y,
          backgroundColor: "rgba(0,0,0,0.5)",
          // border: '1px solid purple',
          display: "none",
          padding: "10px",
          zIndex: 10001,
          color: "white",
        }}
      >
        <h1>playlist1</h1>
        <h1>playlist2</h1>
        <h1>playlist3</h1>
      </div>
    </div>
  );
};
// function CustomContextMenu() {
// 	const [contextMenuPosition, setContextMenuPosition] = useState(null);

// 	const handleContextMenu = (event) => {
// 		event.preventDefault();
// 		setContextMenuPosition({ x: event.pageX, y: event.pageY });
// 	};

// 	const handleCloseContextMenu = () => {
// 		setContextMenuPosition(null);
// 	};

// 	return (
// 		<div onContextMenu={handleContextMenu} onClick={handleCloseContextMenu}>
// 			{contextMenuPosition && (
// 				<div>
// 					<ContextMenu {...contextMenuPosition} />
// 				</div>
// 			)}
// 			<p>
// 				Right-click anywhere in this component to see the custom context menu
// 			</p>
// 		</div>
// 	);
// }
export default CustomContextMenu;
