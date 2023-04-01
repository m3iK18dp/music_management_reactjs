// import React, { useEffect, useState, useRef } from "react";
// import { Container, Row, Button, Form } from "react-bootstrap";
// import songService from "../services/SongService";
// import { useParams, useNavigate } from "react-router-dom";
// import { AiFillSave } from "react-icons/ai";
// import { MdCancel } from "react-icons/md";
// import LastUpdateTimeComponent from "../components/LastUpdateTimeComponent";
// import NavbarComponent from "../components/NavbarComponent";
// import CustomFormGroup from "../components/CustomFormGroup";
// function UpdateSong() {
//   const navigate = useNavigate();
//   const id = useParams();
//   const [song, setSong] = useState({
//     id: id.id,
//     title: "",
//     genre: "",
//     musician: "",
//   });
//   const file = useRef("");
//   const [titleIsFilled, setTitleIsFilled] = useState("");
//   const [status, setStatus] = useState("");
//   const [statusRes, setStatusRes] = useState("error");
//   const [isFirst, setIsFirst] = useState(true);
//   useEffect(() => {
//     songService.get({ _id: id.id }).then((data) => {
//       console.log(data.data);
//       setSong(data.data.content[0]);
//     });
//   }, [id]);
//   useEffect(() => {
//     setTitleIsFilled(
//       song.title === "" && !isFirst ? `Please enter a title` : ""
//     );
//   }, [song, isFirst, status]);
//   useEffect(() => {
//     setStatus("");
//   }, [song]);
//   const set = (prop, value) => {
//     setSong({ ...song, [prop]: value });
//   };
//   async function handleSubmit() {
//     setIsFirst(false);
//     if (song.title !== "") {
//       setStatus("Please wait...Updating song is in progress");
//       try {
//         if (file.current.files.length > 0) {
//           await songService
//             .updateSongWithFile(id.id, song, file.current.files[0])
//             .then((res) => setStatusRes(res.status));
//         } else {
//           await songService
//             .updateSongWithoutFile(id.id, song)
//             .then((res) => setStatusRes(res.status));
//         }
//         if (statusRes === "ok") {
//           setStatus("");
//           alert("Update Song successful!");
//           navigate("/songs");
//         } else if (statusRes === "failed") {
//           setStatus("Update Song failed, try again.");
//         } else if (statusRes === "error") {
//           setStatus("An error occurred during the update, please try again");
//         }
//       } catch (error) {
//         setStatus("An error occurred during the update, please try again");
//         console.log(`An error occurred: ${error.message}`);
//       }
//     } else setStatus("Please enter full information.");
//   }
//   return (
//     <>
//       <NavbarComponent />
//       <div className="background-container" />
//       <Container>
//         <Row
//           className="col-md-8 offset-md-2"
//           style={{
//             margin: "15px auto",
//             border: "3px solid purple",
//             backgroundColor: "white",
//             maxWidth: 500,
//             borderRadius: 10,
//           }}
//         >
//           <div className="card">
//             <h1
//               className="text-center"
//               style={{
//                 borderBottom: "2px solid purple",
//                 padding: "20px",
//                 marginBottom: "0",
//               }}
//             >
//               Update song
//             </h1>
//             <div className="card-body">
//               <Form>
//                 <CustomFormGroup
//                   controlId="id"
//                   label="Id"
//                   value={song.id}
//                   type="text"
//                   readOnly={true}
//                 />
//                 <CustomFormGroup
//                   funcEnter={handleSubmit}
//                   controlId="title"
//                   func={set}
//                   placeholder="Enter song title"
//                   label="Title"
//                   value={song.title}
//                   type="text"
//                   warning={titleIsFilled}
//                 />
//                 <CustomFormGroup
//                   funcEnter={handleSubmit}
//                   controlId="genre"
//                   func={set}
//                   placeholder="Enter genre"
//                   label="Genre"
//                   value={song.genre}
//                   type="text"
//                 />
//                 <CustomFormGroup
//                   funcEnter={handleSubmit}
//                   controlId="musician"
//                   func={set}
//                   placeholder="Enter musician"
//                   label="Musician"
//                   value={song.musician}
//                   type="text"
//                 />
//                 <CustomFormGroup
//                   funcEnter={handleSubmit}
//                   controlId="file"
//                   label="File Song"
//                   type="file"
//                   ref={file}
//                 />
//                 <div className="box-footer">
//                   <Button
//                     onClick={handleSubmit}
//                     style={{
//                       backgroundColor: "#e9ecef",
//                       border: "none",
//                       color: "black",
//                     }}
//                     title="Save"
//                   >
//                     <AiFillSave size={30}></AiFillSave>Save
//                   </Button>
//                   <Button
//                     variant="danger"
//                     href="/songs"
//                     style={{
//                       backgroundColor: "#e9ecef",
//                       border: "none",
//                       color: "black",
//                       marginLeft: 20,
//                     }}
//                   >
//                     <MdCancel size={30}></MdCancel>Cancel
//                   </Button>
//                   <LastUpdateTimeComponent date={song.lastUpdate} />
//                 </div>{" "}
//                 <div style={{ height: 5 }}>
//                   <p
//                     style={{
//                       fontStyle: "italic",
//                       color: "red",
//                       margin: 0,
//                       fontSize: 12,
//                     }}
//                   >
//                     {status}
//                   </p>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </Row>
//       </Container>
//     </>
//   );
// }

// export default UpdateSong;
