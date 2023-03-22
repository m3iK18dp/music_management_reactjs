import React, { useRef } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import songService from "../services/SongService";
import { useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
function NewSong() {
  const navigate = useNavigate();
  const title = useRef("");
  const genre = useRef("");
  const musician = useRef("");
  const file = useRef();
  function handleSubmit() {
    try {
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
            alert("Add new Song failed.");
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Container>
      <Row className="col-md-8 offset-md-2">
        <div className="card">
          <h1 className="text-center" style={{ margin: "10px auto 0 auto" }}>
            Add song
          </h1>
          <div className="card-body">
            <Form
              action="/songs/new"
              method="POST"
              encType="multipart/form-data"
            >
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", marginTop: 20 }}>
                  Title
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter song name"
                  ref={title}
                  required
                />
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
              </div>
            </Form>
          </div>
        </div>
      </Row>
    </Container>
  );
}

export default NewSong;
