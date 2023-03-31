import React, { useRef, useState } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import songService from "../services/SongService";
import { useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import NavbarComponent from "../components/NavbarComponent";
function NewUser() {
  const navigate = useNavigate();
  // const title = useRef();
  // const genre = useRef();
  // const musician = useRef();
  const [song, setSong] = useState();
  const file = useRef();
  const [titleIsFilled, setTitleIsFilled] = useState("");
  const [fileIsFilled, setFileIsFilled] = useState("");
  const [status, setStatus] = useState("");
  const set = (prop, value) => {
    setSong({ ...song, [prop]: value });
  };
  function handleSubmit() {
    setTitleIsFilled(song.title === "" ? `Please enter a title` : "");

    setFileIsFilled(!file.current.files[0] ? "Please select file" : "");

    if (song.title === "" || !file.current.files[0]) setStatus("");
    else {
      songService.insertSong(song, file.current.files[0]).then((res) => {
        if (res.status === "ok") {
          alert("Add new Song successful!");
          navigate("/songs");
        } else {
          setStatus("Create new Song failed, try again.");
        }
      });
    }
  }
  return (
    <>
      <NavbarComponent />
      <div className="background-container" />
      <Container>
        <Row
          className="col-md-8 offset-md-2"
          style={{
            margin: "15px auto",
            border: "3px solid purple",
            backgroundColor: "white",
            maxWidth: 500,
            borderRadius: 10,
          }}
        >
          <div className="card">
            <h1
              className="text-center"
              style={{
                borderBottom: "2px solid purple",
                padding: "20px",
                marginBottom: "0",
              }}
            >
              Add song
            </h1>
            <div className="card-body">
              <Form
                action="/songs/new"
                method="POST"
                encType="multipart/form-data"
              >
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold" }}>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter song name"
                    onChange={(event) => set("title", event.target.value)}
                    required
                  />
                  <div style={{ height: 5 }}>
                    <p
                      style={{
                        fontStyle: "italic",
                        color: "red",
                        margin: 0,
                        fontSize: 12,
                      }}
                    >
                      {titleIsFilled}
                    </p>
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", marginTop: 20 }}>
                    Genre
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="genre"
                    placeholder="Enter genre"
                    onChange={(event) => set("genre", event.target.value)}
                  />
                  <div style={{ height: 5 }}>
                    <p
                      style={{
                        fontStyle: "italic",
                        color: "red",
                        margin: 0,
                        fontSize: 12,
                      }}
                    ></p>
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", marginTop: 20 }}>
                    Musician
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="musician"
                    placeholder="Enter musician"
                    onChange={(event) => set("musician", event.target.value)}
                  />
                  <div style={{ height: 5 }}>
                    <p
                      style={{
                        fontStyle: "italic",
                        color: "red",
                        margin: 0,
                        fontSize: 12,
                      }}
                    ></p>
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", marginTop: 20 }}>
                    File song
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="audioFile"
                    ref={file}
                    required
                  />
                  <div style={{ height: 5 }}>
                    <p
                      style={{
                        fontStyle: "italic",
                        color: "red",
                        margin: 0,
                        fontSize: 12,
                      }}
                    >
                      {fileIsFilled}
                    </p>
                  </div>
                </Form.Group>
                <div className="box-footer">
                  <Button
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: "#e9ecef",
                      border: "none",
                      color: "black",
                    }}
                    title="Save"
                  >
                    <AiFillSave size={30}></AiFillSave>Save
                  </Button>
                  <Button
                    variant="danger"
                    href="/songs"
                    style={{
                      backgroundColor: "#e9ecef",
                      border: "none",
                      color: "black",
                      marginLeft: 20,
                    }}
                  >
                    <MdCancel size={30}></MdCancel>Cancel
                  </Button>
                </div>{" "}
                <p style={{ marginBottom: "0px" }}>{status}</p>
              </Form>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default NewUser;
