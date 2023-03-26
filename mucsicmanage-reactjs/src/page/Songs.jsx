import "../css/songs.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
    currentSongIndex: 0,
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
    if (path !== "")
      path
        .slice(1)
        .split("&")
        .forEach((pathParam) => {
          const param = pathParam.split("=");
          search[param[0]] =
            param[0] === "page" ? parseInt(param[1]) - 1 : param[1];
        });
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
    ].forEach(
      (prop) =>
        (params[`_${prop}`] =
          prop === "id" ? (get(prop) > 0 ? get(prop) : -1) : get(prop))
    );
    songService.get(params).then((data) => {
      set("totalPages", data.data.totalPages);
      set("currentSongs", data.data.content);
      set("currentSongPlay", data.data.content[0].id);
      set("currentSongPlayUrl", data.data.content[0].url);
      console.log("==========================");
      console.log(params);
      console.log(search);
      console.log(data.data);
      console.log(get("totalPages"));
      console.log(get("currentSongs"));
      console.log(get("currentSongPlay"));
      console.log(get("currentSongPlayUrl"));
      console.log("==========================");
    });
  }, [path]);
  const handlePlaySong = (id, url) => {
    if (get("currentSongPlay") !== id) {
      set("currentSongPlay", id);
      set("currentSongPlayUrl", url);
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
  const handleDelete = (id) => {
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
      (get("currentSongIndex") + get("currentSongs").length - 1) %
      get("currentSongs").length;
    set("currentSongIndex", newIndex);
    set("currentSongPlayUrl", get("currentSongs")[newIndex].url);
    set("currentSongPlay", get("currentSongs")[newIndex].id);
  };
  const nextSong = () => {
    const newIndex = (get("currentSongIndex") + 1) % get("currentSongs").length;
    set("currentSongIndex", newIndex);
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
    <>
      <NavbarComponent />
      <Container fluid style={{ marginTop: 80 }}>
        <Form>
          <Row>
            <Col className="col" xl={1}>
              <Form.Label>
                <strong>ID</strong>
              </Form.Label>
            </Col>
            <Col className="col" xl={4}>
              <Form.Control
                type="number"
                min="1"
                // type="text"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder={"Enter Search with ID"}
                value={get("id")}
                onChange={(event) => set("id", event.target.value)}
              />
            </Col>
            <Col className="col" xl={1}>
              <div
                className="mr-15"
                style={{ display: "inline" }}
                onClick={() => handleCancelSearch("id")}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Cancel Search with ID"
              >
                <MdCancel size={40} color="black"></MdCancel>
              </div>
            </Col>
            <Col className="col" xl={1}>
              <Form.Label>
                <strong>Title</strong>
              </Form.Label>
            </Col>
            <Col className="col" xl={4}>
              <Form.Control
                type="text"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder={"Enter Search with Title"}
                value={get("title")}
                onChange={(event) => set("title", event.target.value)}
              />
            </Col>
            <Col className="col" xl={1}>
              <div
                className="mr-15"
                style={{ display: "inline" }}
                onClick={() => handleCancelSearch("title")}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Cancel Search with Title"
              >
                <MdCancel size={40} color="black"></MdCancel>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="col" xl={1}>
              <Form.Label>
                <strong>Genre</strong>
              </Form.Label>
            </Col>
            <Col className="col" xl={4}>
              <Form.Control
                type="text"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder={"Enter Search with Genre"}
                value={get("genre")}
                onChange={(event) => set("genre", event.target.value)}
              />
            </Col>
            <Col className="col" xl={1}>
              <div
                className="mr-15"
                style={{ display: "inline" }}
                onClick={() => handleCancelSearch("genre")}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Cancel Search with Genre"
              >
                <MdCancel size={40} color="black"></MdCancel>
              </div>
            </Col>
            <Col className="col" xl={1}>
              <Form.Label>
                <strong>Musician</strong>
              </Form.Label>
            </Col>
            <Col className="col" xl={4}>
              <Form.Control
                type="text"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder={"Enter Search with Musician"}
                value={get("musician")}
                onChange={(event) => {
                  set("musician", event.target.value);
                }}
              />
            </Col>
            <Col className="col" xl={1}>
              <div
                className="mr-15"
                style={{ display: "inline" }}
                onClick={() => handleCancelSearch("musician")}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Cancel Search with Musician"
              >
                <MdCancel size={40} color="black"></MdCancel>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div
                className="mr-15"
                style={{ display: "inline" }}
                onClick={() => handleSearch()}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Search Song"
              >
                <BsFillSearchHeartFill
                  size={40}
                  color="black"
                ></BsFillSearchHeartFill>
              </div>
            </Col>
            <Col>
              <div
                className="mr-15"
                style={{ display: "inline" }}
                onClick={() => handleCancelSearch("all")}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Cancel Search All filter"
              >
                <ImCancelCircle size={40} color="black"></ImCancelCircle>
              </div>
            </Col>
            <Col>
              <Link
                style={{ display: "inline" }}
                to={"/songs/new"}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Add new Song"
              >
                <RiHeartAddFill size={40} color="black"></RiHeartAddFill>
              </Link>
            </Col>
          </Row>
        </Form>
        <audio
          src={get("currentSongPlayUrl")}
          controls={["volume", "seekbar", "duration"]}
          autoPlay={get("playing")}
          ref={audio}
        />
        <div className="controls-audio">
          <div
            className="mr-15"
            onClick={previousSong}
            onMouseOver={(e) => {
              e.target.style.color = "rgb(40, 144, 144)";
              e.target.style.cursor = "pointer";
            }}
            onMouseOut={(e) => (e.target.style.color = "black")}
          >
            <BsSkipStartCircleFill size={30} color="black" variant="primary" />
          </div>
          <div
            className="mr-15"
            onMouseOver={(e) => {
              e.target.style.color = "rgb(40, 144, 144)";
              e.target.style.cursor = "pointer";
            }}
            onMouseOut={(e) => (e.target.style.color = "black")}
          >
            {!get("playing") && (
              <BsPlayCircleFill
                onClick={handlePlay}
                size={30}
                color="black"
                variant="primary"
              />
            )}
            {get("playing") && (
              <BsPauseCircleFill
                onClick={handlePause}
                size={30}
                color="black"
                variant="primary"
              />
            )}
          </div>
          <div
            onClick={nextSong}
            className="mr-15"
            onMouseOver={(e) => {
              e.target.style.color = "rgb(40, 144, 144)";
              e.target.style.cursor = "pointer";
            }}
            onMouseOut={(e) => (e.target.style.color = "black")}
          >
            <BsSkipEndCircleFill size={30} color="black" variant="primary" />
          </div>
        </div>
        <Table striped bordered>
          <colgroup>
            <col width="50" span="2" />
            <col width="auto" span="1" />
            <col width="110" span="2" />
            <col width="150" span="1" />
          </colgroup>
          <thead className="table-dark">
            <tr>
              <th>STT</th>
              <th onClick={() => handleSort("id")}>
                ID
                {get("field") === "id" && (
                  <>
                    {get("type_sort") === "asc" && (
                      <BsSortNumericUpAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                    {get("type_sort") === "desc" && (
                      <BsSortNumericDownAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                  </>
                )}
              </th>
              <th onClick={() => handleSort("title")}>
                Title
                {get("field") === "title" && (
                  <>
                    {get("type_sort") === "asc" && (
                      <BsSortAlphaUpAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                    {get("type_sort") === "desc" && (
                      <BsSortAlphaDownAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                  </>
                )}
              </th>
              <th onClick={() => handleSort("genre")}>
                Genre
                {get("field") === "genre" && (
                  <>
                    {get("type_sort") === "asc" && (
                      <BsSortAlphaUpAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                    {get("type_sort") === "desc" && (
                      <BsSortAlphaDownAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                  </>
                )}
              </th>
              <th onClick={() => handleSort("musician")}>
                Musician
                {get("field") === "musician" && (
                  <>
                    {get("type_sort") === "asc" && (
                      <BsSortAlphaUpAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                    {get("type_sort") === "desc" && (
                      <BsSortAlphaDownAlt
                        size={15}
                        style={{ marginLeft: "2px" }}
                      />
                    )}
                  </>
                )}
              </th>
              <th className="column-">Actions</th>
            </tr>
          </thead>
          <tbody>
            {get("currentSongs").map((song, index) => (
              <tr key={song.id}>
                <td>{index + 1}</td>
                <td>{song.id}</td>
                <td>{song.title}</td>
                <td>{song.genre}</td>
                <td>{song.musician}</td>
                <td>
                  <div>
                    <div
                      style={{ display: "inline" }}
                      onClick={() => handlePlaySong(song.id, song.url)}
                      className="mr-15"
                      onMouseOver={(e) => {
                        e.target.style.color = "rgb(40, 144, 144)";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      {(get("currentSongPlay") !== song.id ||
                        !get("playing")) && (
                        <BsPlayCircleFill
                          size={30}
                          color="black"
                          variant="primary"
                        />
                      )}
                      {get("currentSongPlay") === song.id && get("playing") && (
                        <BsPauseCircleFill
                          size={30}
                          color="black"
                          variant="primary"
                        />
                      )}
                    </div>
                    <Link
                      to={`/songs/${song.id}`}
                      className="mr-15"
                      onMouseOver={(e) => {
                        e.target.style.color = "rgb(40, 144, 144)";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      <AiFillEdit size={30} color="black" variant="primary" />
                    </Link>
                    <div
                      style={{ display: "inline" }}
                      onClick={() => handleDelete(song.id)}
                      onMouseOver={(e) => {
                        e.target.style.color = "red";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      <AiFillDelete size={30} color="black" variant="danger" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row>
          <PaginationComponent
            currentPage={get("_page")}
            totalPages={get("totalPages")}
            songsPerPage={get("limit")}
          />
        </Row>
      </Container>
    </>
  );
}

export default Songs;
