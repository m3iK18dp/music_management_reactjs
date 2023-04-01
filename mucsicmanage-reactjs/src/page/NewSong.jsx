// import React, { useRef, useState, useEffect } from "react";
// import { Container, Row, Button, Form } from "react-bootstrap";
// import songService from "../services/SongService";
// import { useNavigate } from "react-router-dom";
// import { AiFillSave } from "react-icons/ai";
// import { MdCancel } from "react-icons/md";
// import NavbarComponent from "../components/NavbarComponent";
// import CustomFormGroup from "../components/CustomFormGroup";
// function NewUser() {
//   const navigate = useNavigate();
//   const [song, setSong] = useState({ title: "" });
//   const [changeFile, setChangeFile] = useState(true);
//   const file = useRef(null);
//   const [titleIsFilled, setTitleIsFilled] = useState("");
//   const [fileIsFilled, setFileIsFilled] = useState("");
//   const [status, setStatus] = useState("");
//   const [isFirst, setIsFirst] = useState(true);

//   const set = (prop, value) => {
//     if (prop === "file") setChangeFile(!changeFile);
//     else setSong({ ...song, [prop]: value });
//   };
//   useEffect(() => {
//     if (!isFirst) {
//       setTitleIsFilled(song.title === "" ? `Please enter a title` : "");
//       setFileIsFilled(
//         file.current.files.length === 0 ? "Please select file" : ""
//       );
//     }
//   }, [isFirst, song, status, changeFile]);
//   useEffect(() => {
//     setStatus("");
//   }, [song, changeFile]);
//   function handleSubmit() {
//     setIsFirst(false);
//     if (!(song.title === "" || file.current.files.length === 0)) {
//       setStatus("Please wait...Saving song is in progress");

//       songService.insertSong(song, file.current.files[0]).then((res) => {
//         if (res.status === "ok") {
//           setStatus("");
//           alert("Add new Song successful!");
//           navigate("/songs");
//         } else if (res.status === "failed") {
//           setStatus("Create new Song failed, try again.");
//         } else if (res.status === "error") {
//           setStatus("An error occurred during the update, please try again");
//         }
//       });
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
//               Add song
//             </h1>
//             <div className="card-body">
//               <Form>
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
//                   func={set}
//                   controlId="file"
//                   label="File Song"
//                   type="file"
//                   warning={fileIsFilled}
//                   ref={file}
//                 />
//                 <div className="box-footer">
//                   <Button
//                     onClick={handleSubmit}
//                     style={{
//                       backgroundColor: "#e9ecef",
//                       border: "none",
//                       color: "black",
//                       marginTop: 40,
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
//                       marginTop: 40,
//                     }}
//                   >
//                     <MdCancel size={30}></MdCancel>Cancel
//                   </Button>
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

// export default NewUser;
