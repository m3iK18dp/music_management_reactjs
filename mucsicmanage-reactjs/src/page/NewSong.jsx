import React, { useRef, useState } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import songService from "../services/SongService";
import { useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import NavbarComponent from "../components/NavbarComponent";
function NewUser() {
  const navigate = useNavigate();
  const title = useRef();
  const genre = useRef();
  const musician = useRef();
  const file = useRef();
  const [titleIsFilled, setTitleIsFilled] = useState("");
  const [fileIsFilled, setFileIsFilled] = useState("");
  const [status, setStatus] = useState("");
  const [check, setCheck] = useState(true);
  function handleSubmit() {
    if (!title.current.value) {
      setTitleIsFilled(`The title field cannot be blank, please enter a title`);
      setCheck(false);
    } else {
      setTitleIsFilled();
      setCheck(true);
    }
    if (!file.current.files[0]) {
      setFileIsFilled("Vui lòng nhập file để tiếp tục");
      setCheck(false);
    } else {
      setFileIsFilled();
      setCheck(true);
    }
    if (!check) setStatus();
    else {
      songService
        .insertSong(
          {
            title: title.current.value,
            genre: genre.current.value,
            musician: musician.current.value,
          },
          file.current.files[0]
        )
        .then((res) => {
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
      <Container>
        <Row
          className="col-md-8 offset-md-2"
          style={{
            margin: "50px auto",
            border: "3px solid purple",
            backgroundColor: "white",
            maxWidth: 500,
          }}
        >
          <div className="card">
            <h1 className="text-center">Add song</h1>
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
                    ref={title}
                    required
                  />
                  {titleIsFilled && (
                    <p style={{ marginBottom: "0px" }}>{titleIsFilled}</p>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", marginTop: 20 }}>
                    Genre
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="genre"
                    placeholder="Enter genre"
                    ref={genre}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold", marginTop: 20 }}>
                    Musician
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="musician"
                    placeholder="Enter musician"
                    ref={musician}
                  />
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
                  {fileIsFilled && (
                    <p style={{ marginBottom: "0px" }}>{fileIsFilled}</p>
                  )}
                </Form.Group>
                <div className="box-footer">
                  <Button
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: "#e9ecef",
                      border: "none",
                      color: "black",
                      marginTop: 20,
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
                      marginTop: 20,
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
