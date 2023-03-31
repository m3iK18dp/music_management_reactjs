import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import songService from "../services/SongService";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import LastUpdateTimeComponent from "../components/LastUpdateTimeComponent";
import NavbarComponent from "../components/NavbarComponent";
function UpdateSong() {
  const navigate = useNavigate();
  const [song, setSong] = useState({});
  const id = useParams();
  const file = useRef("");
  const [titleIsFilled, setTitleIsFilled] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    console.log(id.id);
    songService.get({ _id: id.id }).then((data) => {
      console.log(data.data);
      setSong(data.data.content[0]);
    });
  }, [id]);
  const set = (prop, value) => {
    setSong({ ...song, [prop]: value });
  };
  function handleSubmit() {
    setTitleIsFilled(song.title === "" ? `Please enter a title` : "");

    if (song.title === "") setStatus("");
    else {
      if (file.current.files[0]) {
        songService
          .updateSongWithFile(id._id, song, file.current.files[0])
          .then((res) => {
            if (res.status === "ok") {
              alert("Update Song successful!");
              navigate("/songs");
            } else {
              setStatus("Update Song failed, try again.");
            }
          });
      } else {
        songService.updateSongWithoutFile(id._id, song).then((res) => {
          if (res.status === "ok") {
            alert("Update Song successful!");
            navigate("/songs");
          } else {
            setStatus("Update Song failed, try again.");
          }
        });
      }
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
              Update song
            </h1>
            <div className="card-body">
              <Form
                action="/songs/new"
                method="POST"
                encType="multipart/form-data"
              >
                <Form.Group>
                  <Form.Label style={{ fontWeight: "bold" }}>ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={song.id}
                    readOnly
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
                  <Form.Label style={{ fontWeight: "bold", marginTop: 10 }}>
                    Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter song name"
                    onChange={(event) => set("title", event.target.value)}
                    value={song.title}
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
                  <Form.Label style={{ fontWeight: "bold", marginTop: 10 }}>
                    Genre
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="genre"
                    placeholder="Enter genre"
                    onChange={(event) => set("genre", event.target.value)}
                    value={song.genre}
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
                  <Form.Label style={{ fontWeight: "bold", marginTop: 10 }}>
                    Musician
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="musician"
                    placeholder="Enter musician"
                    onChange={(event) => set("musician", event.target.value)}
                    value={song.musician}
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
                  <Form.Label style={{ fontWeight: "bold", marginTop: 10 }}>
                    File song
                  </Form.Label>
                  <Form.Control type="file" name="audioFile" ref={file} />
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
                  <LastUpdateTimeComponent date={song.lastUpdate} />
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

export default UpdateSong;
