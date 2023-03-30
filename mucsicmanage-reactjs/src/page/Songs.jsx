import "../css/songs.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  BsPlayCircleFill,
  BsFillSearchHeartFill,
  BsPauseCircleFill,
  BsSortNumericUpAlt,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortAlphaDownAlt,
  BsSkipEndCircleFill,
  BsSkipStartCircleFill,
} from "react-icons/bs";
import { RiHeartAddFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import PaginationComponent from "../components/PaginationComponent";
import NavbarComponent from "../components/NavbarComponent";
import songService from "../services/SongService";
import convertPathSearchUrl from "../services/ConvertPathSearchUrl";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import CustomTableHeaderWithSort from "../components/CustomTableHeaderWithSort";
function Songs() {
  const navigate = useNavigate();
  const audio = useRef(new Audio());
  const path = useLocation().search;
  const [search, setSearch] = useState({
    id: Number,
    title: "",
    genre: "",
    musician: "",
    page: 0,
    limit: 10,
    field: "id",
    type_sort: "asc",
    totalPages: 0,
    currentSongs: [],
    currentSongPlay: 0,
    currentSongPlayUrl: "",
    playing: false,
  });
  const get = (field) => {
    return search[field];
  };
  const set = (field, value) => {
    setSearch((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    [
      "id",
      "title",
      "genre",
      "musician",
      "page",
      "limit",
      "field",
      "type_sort",
    ].forEach((prop) => {
      const value = searchParams.get(prop);
      if (value !== null)
        search[prop] = prop === "page" ? parseInt(value) - 1 : value;
      params[`_${prop}`] =
        prop === "id" ? (get(prop) > 0 ? get(prop) : -1) : get(prop);
    });

    songService.get(params).then((data) => {
      set("totalPages", data.data.totalPages);
      set("currentSongs", data.data.content);
      set("currentSongPlay", data.data.content[0].id);
      set("currentSongPlayUrl", data.data.content[0].url);
    });
  }, [path]);
  const handlePlaySong = (id) => {
    if (get("currentSongPlay") !== id) {
      set("currentSongPlay", id);
      set(
        "currentSongPlayUrl",
        get("currentSongs").find((s) => s.id === id).url
      );
      handlePlay(true);
    } else {
      set("currentSongPlay", -1);
      handlePause();
    }
  };
  const handleSearch = () => {
    const search = [];

    ["id", "title", "genre", "musician"].forEach((field) => {
      search.push({
        property: field,
        value: get(field),
      });
    });
    navigate(convertPathSearchUrl(search));
  };
  const handleCancelSearch = (searchField) => {
    const search = [];
    (searchField === "all"
      ? ["id", "title", "genre", "musician"]
      : [searchField]
    ).forEach((field) => {
      set(field, "");
      search.push({ property: field, value: "" });
    });
    navigate(convertPathSearchUrl(search));
  };
  const handleNewSong = () => {
    navigate("/songs/new");
  };
  const handleUpdateSong = (id) => {
    navigate(`/songs/${id}`);
  };
  const handleDeleteSong = (id) => {
    if (window.confirm("Do you want to delete this song?")) {
      songService.deleteSong(id);
      set(
        "currentSongs",
        get("currentSongs").filter((song) => song.id !== id)
      );
    }
  };
  const handlePlay = () => {
    set("playing", true);
    audio.current.play();
  };
  const handlePause = () => {
    set("playing", false);
    audio.current.pause();
  };
  const previousSong = () => {
    const newIndex =
      (get("currentSongs").findIndex(
        (song) => song.id === get("currentSongPlay")
      ) +
        get("currentSongs").length -
        1) %
      get("currentSongs").length;
    set("currentSongPlayUrl", get("currentSongs")[newIndex].url);
    set("currentSongPlay", get("currentSongs")[newIndex].id);
  };
  const nextSong = () => {
    const newIndex =
      (get("currentSongs").findIndex(
        (song) => song.id === get("currentSongPlay")
      ) +
        get("currentSongs").length +
        1) %
      get("currentSongs").length;
    set("currentSongPlayUrl", get("currentSongs")[newIndex].url);
    set("currentSongPlay", get("currentSongs")[newIndex].id);
  };
  const handleSort = (field) => {
    navigate(
      convertPathSearchUrl([
        { property: "field", value: field },
        {
          property: "type_sort",
          value:
            get("field") !== field
              ? "asc"
              : get("type_sort") === "asc"
              ? "desc"
              : "asc",
        },
      ])
    );
  };
  return (
    <div style={{ overflow: "hidden" }}>
      <NavbarComponent />
      <Container
        fluid
        style={{
          position: "fixed",
          top: 55,
          left: 0,
          right: 0,
          zIndex: 9,
          padding: 5,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Form>
          <Row>
            {["Id", "Title"].map((field) => (
              <React.Fragment key={field}>
                <CustomInput
                  set={set}
                  get={get}
                  field={field}
                  type={field === "Id" ? "number" : "text"}
                  min={field === "Id" ? 1 : "none"}
                  func={handleSearch}
                  size={4}
                />
                <Col className="col" xl={1}>
                  <CustomButton
                    field={field}
                    IconButton={MdCancel}
                    func={handleCancelSearch}
                    title={`Cancel Search with ${field}`}
                  />
                </Col>
              </React.Fragment>
            ))}
          </Row>
          <Row>
            {["Genre", "Musician"].map((field) => (
              <React.Fragment key={field}>
                <CustomInput
                  set={set}
                  get={get}
                  field={field}
                  func={handleSearch}
                  size={4}
                />
                <Col className="col" xl={1}>
                  <CustomButton
                    field={field}
                    IconButton={MdCancel}
                    func={handleCancelSearch}
                    title={`Cancel Search with ${field}`}
                  />
                </Col>
              </React.Fragment>
            ))}
          </Row>
          <Row />
          <Row>
            <Col />
            <Col />
            <Col>
              <CustomButton
                IconButton={BsFillSearchHeartFill}
                func={handleSearch}
                title={"Search Song"}
              />
            </Col>
            <Col>
              <CustomButton
                field="all"
                IconButton={ImCancelCircle}
                func={handleCancelSearch}
                title={"Cancel Search All filter"}
              />
            </Col>
            <Col>
              <CustomButton
                IconButton={RiHeartAddFill}
                func={handleNewSong}
                title={"Add new Song"}
              />
            </Col>
            <Col />
            <Col />
          </Row>
        </Form>
        <Row></Row>
        <audio
          src={get("currentSongPlayUrl")}
          controls={["volume", "seekbar", "duration"]}
          autoPlay={get("playing")}
          ref={audio}
        />
        <Row className="controls-audio">
          <Col />
          <Col className="control">
            <CustomButton
              IconButton={BsSkipStartCircleFill}
              size={35}
              func={previousSong}
              title={"Prev Song"}
            />
          </Col>
          <Col className="control">
            <CustomButton
              IconButton={
                !get("playing") ? BsPlayCircleFill : BsPauseCircleFill
              }
              size={35}
              func={!get("playing") ? handlePlay : handlePause}
              title={!get("playing") ? "Play" : "Pause"}
            />
          </Col>
          <Col className="control">
            <CustomButton
              IconButton={BsSkipEndCircleFill}
              size={35}
              func={nextSong}
              title={"Next Song"}
            />
          </Col>
          <Col />{" "}
        </Row>
      </Container>
      <Container
        style={{
          marginTop: 320,
          overflow: "hidden",
          overflowX: "scroll",
        }}
      >
        <Table
          striped
          bordered
          style={{
            borderWidth: "0px 0",
          }}
        >
          <colgroup>
            <col width="50" span="2" />
            <col width="auto" span="3" />
            <col width="110" span="1" />
          </colgroup>
          <thead className="table-dark">
            <tr>
              <th>STT</th>
              {[
                {
                  field: "ID",
                  icon: [BsSortNumericUpAlt, BsSortNumericDownAlt],
                },
                {
                  field: "Title",
                  icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
                },
                {
                  field: "Genre",
                  icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
                },
                {
                  field: "Musician",
                  icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
                },
              ].map((row) => {
                return (
                  <CustomTableHeaderWithSort
                    get={get}
                    key={row.field}
                    field={row.field}
                    func={handleSort}
                    IconAsc={row.icon[0]}
                    IconDesc={row.icon[1]}
                  />
                );
              })}
              <th className="column-">Actions</th>
            </tr>
          </thead>
          <tbody>
            {get("currentSongs").map((song, index) => (
              <tr key={song.id}>
                <td>{index + 1}</td>
                <td>{song.id}</td>
                <td style={{ textAlign: "left" }}>{song.title}</td>
                <td>{song.genre}</td>
                <td>{song.musician}</td>
                <td>
                  <CustomButton
                    field={song.id}
                    IconButton={
                      get("currentSongPlay") !== song.id || !get("playing")
                        ? BsPlayCircleFill
                        : BsPauseCircleFill
                    }
                    size={30}
                    func={handlePlaySong}
                    title={
                      get("currentSongPlay") !== song.id || !get("playing")
                        ? "Play"
                        : "Pause"
                    }
                  />
                  <CustomButton
                    field={song.id}
                    IconButton={AiFillEdit}
                    size={30}
                    func={handleUpdateSong}
                    title={"Edit Song"}
                  />
                  <CustomButton
                    field={song.id}
                    IconButton={AiFillDelete}
                    size={30}
                    func={handleDeleteSong}
                    title={"Delete Song"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <div style={{ visibility: "hidden", height: 50 }} />
      <Row>
        <PaginationComponent
          currentPage={get("page")}
          totalPages={get("totalPages")}
          objectsPerPage={get("limit")}
        />
      </Row>
    </div>
  );
}

export default Songs;
