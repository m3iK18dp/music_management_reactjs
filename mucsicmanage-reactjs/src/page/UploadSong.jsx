import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import songService from "../services/SongService";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import LastUpdateTimeComponent from "../components/LastUpdateTimeComponent";
import NavbarComponent from "../components/NavbarComponent";
import CustomFormGroup from "../components/CustomFormGroup";
import { checkToken } from "../services/CheckToken";
function UploadSong() {
  const id = useParams();
  const navigate = useNavigate();

  const createOrUpdate = isNaN(id.id)
    ? id.id === "new"
      ? "Create"
      : "Error"
    : id.id > 0
    ? "Update"
    : "Error";

  const [song, setSong] = useState({
    id: "",
    title: "",
    genre: "",
    musician: "",
  });
  const set = (prop, value) => {
    if (prop === "file") setChangeFile(!changeFile);
    else setSong({ ...song, [prop]: value });
  };
  const file = useRef(null);
  const [titleIsFilled, setTitleIsFilled] = useState("");
  const [musicianIsFilled, setMusicianIsFilled] = useState("");
  const [genreIsFilled, setGenreIsFilled] = useState("");

  const [fileIsFilled, setFileIsFilled] = useState("");

  const [status, setStatus] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const [changeFile, setChangeFile] = useState(true);
  const [checkForm, setCheckForm] = useState(true);
  useEffect(() => {
    if (createOrUpdate === "Error") navigate("/error/404");
    checkToken(navigate);
    if (createOrUpdate === "Update")
      songService.get({ _id: id.id }, navigate).then((data) => {
        console.log(data.data);
        if (
          createOrUpdate === "Update" &&
          data.data.content[0].ownerEmail !==
            sessionStorage.getItem("username") &&
          !sessionStorage.getItem("roles").includes("ADMIN")
        )
          navigate("/error/403");

        setSong(data.data.content[0]);
      });
  }, [createOrUpdate, id.id]);
  useEffect(() => {
    setCheckForm(true);
    const validateInput = (field, maxLength, message = "", type = 0) => {
      if (type && field.length === 0) {
        setCheckForm(false);
        return !isFirst ? message : "";
      }
      if (field.length > maxLength) {
        setCheckForm(false);
        return `You have exceeded the allowed number of characters ${field.length}/${maxLength}`;
      }
      return "";
    };
    setTitleIsFilled(validateInput(song.title, 100, "Please enter a title", 1));
    setMusicianIsFilled(validateInput(song.musician, 30));
    setGenreIsFilled(validateInput(song.genre, 30));

    if (createOrUpdate === "Create") {
      setFileIsFilled(
        validateInput(file.current.files, Infinity, "Please select file", 1)
      );
    }
  }, [song, isFirst, status, changeFile, createOrUpdate]);
  useEffect(() => {
    setStatus("");
  }, [song, changeFile]);

  function handleSubmit() {
    setIsFirst(false);
    if (checkForm) {
      setStatus(`Please wait...${createOrUpdate} song is in progress`);
      const songServiceFunction =
        createOrUpdate === "Update"
          ? file.current.files.length > 0
            ? songService.updateSongWithFile(
                song.id,
                song,
                file.current.files[0],
                navigate
              )
            : songService.updateSongWithoutFile(song.id, song, navigate)
          : file.current.files.length > 0
          ? songService.insertSong(song, file.current.files[0], navigate)
          : setStatus("Please enter full information.");
      songServiceFunction.then((res) => {
        if (res.status === "ok") {
          setStatus("");
          alert(`${createOrUpdate} Song successful!`);
          navigate("/songs");
        } else if (res.status === "failed") {
          setStatus(`${createOrUpdate} Song failed, try again!`);
        } else {
          setStatus(
            // `An error occurred during the ${createOrUpdate}, please try again!`,
            res.message
          );
        }
      });
    } else setStatus("Failed. Please check information entered.");
  }

  return (
    <>
      <NavbarComponent />
      <div className="background-container" />
      <div className=" background-container-opacity-low" />
      <Container>
        <Row
          className="col-md-8 offset-md-2"
          style={{
            margin: "15px auto",
            border: "3px solid purple",
            width: "60%",
            minWidth: 400,
            maxWidth: 500,
            borderRadius: 10,
          }}
        >
          <div
            className="card"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <h1
              className="text-center  neon"
              style={{
                borderBottom: "2px solid purple",
                padding: "20px",
                marginBottom: "0",
              }}
            >
              {`${createOrUpdate} Song`}
            </h1>
            <div className="card-body">
              <Form>
                {createOrUpdate === "Update" && (
                  <CustomFormGroup
                    controlId="id"
                    label="Id"
                    value={song.id}
                    type="text"
                    readOnly={true}
                  />
                )}
                <CustomFormGroup
                  funcEnter={handleSubmit}
                  controlId="title"
                  func={set}
                  placeholder="Enter song title"
                  label="Title"
                  value={song.title}
                  type="text"
                  warning={titleIsFilled}
                />
                <CustomFormGroup
                  funcEnter={handleSubmit}
                  controlId="genre"
                  func={set}
                  placeholder="Enter genre"
                  label="Genre"
                  value={song.genre}
                  type="text"
                  warning={genreIsFilled}
                />
                <CustomFormGroup
                  funcEnter={handleSubmit}
                  controlId="musician"
                  func={set}
                  placeholder="Enter musician"
                  label="Musician"
                  value={song.musician}
                  type="text"
                  warning={musicianIsFilled}
                />
                <CustomFormGroup
                  funcEnter={handleSubmit}
                  controlId="file"
                  label="File Song"
                  type="file"
                  ref={file}
                  {...(createOrUpdate === "Create" && {
                    func: set,
                    warning: fileIsFilled,
                  })}
                />
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
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "red",
                      margin: 0,
                      fontSize: 12,
                    }}
                  >
                    {status}
                  </p>
                  {createOrUpdate === "Update" && (
                    <LastUpdateTimeComponent date={song.lastUpdate} />
                  )}
                </div>{" "}
              </Form>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default UploadSong;
