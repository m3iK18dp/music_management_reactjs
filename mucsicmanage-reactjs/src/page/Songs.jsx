import "../css/songs.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import {
  BsSearchHeart,
  BsSortNumericUpAlt,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortAlphaDownAlt,
  BsArrowsExpand,
} from "react-icons/bs";
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from "react-icons/ai";
import { RiHeartAddFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { MdOutlineSearchOff } from "react-icons/md";
import PaginationComponent from "../components/PaginationComponent";
import NavbarComponent from "../components/NavbarComponent";
import songService from "../services/SongService";
import convertPathSearchUrl from "../services/ConvertPathSearchUrl";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import CustomTableHeaderWithSort from "../components/CustomTableHeaderWithSort";
import AudioPlayer from "../components/AudioPlayer";
import { checkToken } from "../services/CheckToken";
import CustomContextMenu from "./CustomContextMenu";
function Songs() {
  // 	{
  // 	id = '',
  // 	title ='',
  // 	genre = '',
  // 	musician = '',
  // 	page = 0,
  // 	limit = 10,
  // 	field = 'id',
  // 	type_sort = 'asc',
  // 	owner_email = '',
  // }
  const navigate = useNavigate();
  const prams = useParams();
  const alertRevoked =
    "Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features.";
  const isLoggedIn =
    localStorage.getItem("token") &&
    !JSON.parse(sessionStorage.getItem("isRevoked"));
  const roles = sessionStorage.getItem("roles");
  const isAdmin = roles !== null ? roles.includes("ADMIN") : false;

  const location = useLocation();
  const [search, setSearch] = useState({
    id: "",
    title: "",
    genre: "",
    musician: "",
    page: 0,
    limit: 10,
    field: isAdmin ? "id" : "title",
    type_sort: "asc",
    owner_email:
      location.pathname === "/my_songs"
        ? sessionStorage.getItem("username")
        : "",
    playlist_id: location.pathname.includes("my_playlist")
      ? prams.playlist_id
      : "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [currentSongPlaying, setCurrentSongPlaying] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [expandFilter, setExpandFilter] = useState(false);
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
    checkToken(navigate, 0);
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    if (location.pathname === "/my_songs")
      params._owner_email = sessionStorage.getItem("username");
    if (location.pathname.includes("my_playlist"))
      params._playlist_id = prams.playlist_id;
    [
      { field: "id", default: "" },
      { field: "title", default: "" },
      { field: "genre", default: "" },
      { field: "musician", default: "" },
      { field: "page", default: 0 },
      { field: "limit", default: 10 },
      { field: "field", default: isAdmin ? "id" : "title" },
      { field: "type_sort", default: "asc" },
      {
        field: "owner_email",
        default:
          location.pathname === "/my_songs"
            ? sessionStorage.getItem("username")
            : "",
      },
      {
        field: "playlist_id",
        default: location.pathname.includes("my_playlist")
          ? prams.playlist_id
          : "",
      },
    ].forEach((prop) => {
      const value = searchParams.get(prop.field);
      if (value !== null) {
        search[prop.field] =
          prop.field === "page" ? parseInt(value) - 1 : value;
        params[`_${prop.field}`] = ["id", "playlist_id"].includes(prop.field)
          ? get(prop.field) > 0
            ? get(prop.field)
            : -1
          : get(prop.field);
      } else search[prop.field] = prop.default;
    });
    // if (location.pathname === '/my_songs')
    // 	params['_owner_email'] = sessionStorage.getItem('username');
    songService.get(params, navigate).then((data) => {
      setTotalPages(data.data.totalPages);
      setCurrentSongs(data.data.content);
      if (currentSongPlaying === -1) {
        setCurrentSongPlaying(data.data.content[0].id);
        sessionStorage.setItem("urlPlayingList", window.location.search);
        sessionStorage.setItem(
          "currentSongsPlaying",
          JSON.stringify(data.data.content)
        );
      }
    });
  }, [window.location.search]);

  const handleAudioPlayerUpdate = (songs = currentSongs, type = 0) => {
    // const currentSongsPlayingInSession = ;
    return (
      <AudioPlayer
        style={{ marginTop: 15 }}
        songs={
          type === 0
            ? sessionStorage.getItem("currentSongsPlaying")
              ? JSON.parse(sessionStorage.getItem("currentSongsPlaying"))
              : []
            : songs
        }
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
        setCurrentSongPlaying={setCurrentSongPlaying}
        currentSongPlaying={currentSongPlaying}
        audioRef={audioRef}
        handleCancelSearch={handleCancelSearch}
      />
    );
  };
  const handlePlaySong = (song) => {
    setCurrentSongPlaying(song.id);
    handleAudioPlayerUpdate(currentSongs, 1);
    sessionStorage.setItem("currentSongsPlaying", JSON.stringify(currentSongs));
    sessionStorage.setItem("urlPlayingList", window.location.search);
    if (currentSongPlaying !== song.id) {
      setIsPlaying(true);
      audioRef.current.play();
    } else {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
      ? ["id", "title", "genre", "musician", "field", "type_sort"]
      : [searchField]
    ).forEach((field) => {
      set(
        field,
        {
          id: "",
          title: "",
          genre: "",
          musician: "",
          field: "id",
          type_sort: "asc",
        }[field]
      );
      search.push({ property: field, value: "" });
    });
    navigate(convertPathSearchUrl(search));
  };
  const handleNewSong = () => {
    if (!localStorage.getItem("token"))
      alert(
        "This feature is only available to logged in users. If you want to use it, please login to continue."
      );
    else if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else navigate("/songs/new");
  };
  const handleUpdateSong = (id) => {
    if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else navigate(`/songs/${id}`);
  };
  const handleDeleteSong = (id) => {
    if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else if (window.confirm("Do you want to delete this song?")) {
      songService.deleteSong(id, navigate).then((res) => {
        if (res.status === "ok") {
          alert("You delete Song success!");
          setCurrentSongs(currentSongs.filter((song) => song.id !== id));
        } else {
          alert(res.message);
        }
      });
    }
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
  const handleExpandFilter = () => {
    setExpandFilter(!expandFilter);
  };
  /////////////////
  const [contextMenuPosition, setContextMenuPosition] = useState(null);

  const handleContextMenu = (event, id) => {
    event.preventDefault();
    setContextMenuPosition({
      x: event.pageX,
      y: event.pageY,
      id: id,
      navigate: navigate,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };
  return (
    <div
      style={{ overflow: "hidden", width: "100%" }}
      onClick={handleCloseContextMenu}
    >
      {/* /////////////////////////////////////// */}
      {contextMenuPosition && (
        <div>
          <CustomContextMenu {...contextMenuPosition} />
        </div>
      )}
      <div className="background-container" />
      <div className=" background-container-opacity-low" />

      <NavbarComponent />
      <Container
        fluid="true"
        style={{
          position: "fixed",
          top: 55,
          left: 0,
          right: 0,
          zIndex: 9,
          padding: "5px 30px",
          width: "100%",
          minWidth: 400,
          overflow: "hidden",
        }}
        className={`background-color filter-container ${
          expandFilter ? (isAdmin ? "expanded-no-admin" : "expanded-admin") : ""
        }`}
      >
        <Form
          style={{
            overflow: "hidden",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: 5,
          }}
        >
          {isAdmin ? (
            <>
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
                    <Col className="col">
                      <CustomButton
                        field={field}
                        IconButton={MdCancel}
                        func={handleCancelSearch}
                        title={`Cancel Search with ${field}`}
                        id={`${field}-filter`}
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
                    <Col className="col">
                      <CustomButton
                        field={field}
                        IconButton={MdCancel}
                        func={handleCancelSearch}
                        title={`Cancel Search with ${field}`}
                        id={`${field}-filter`}
                      />
                    </Col>
                  </React.Fragment>
                ))}
              </Row>
            </>
          ) : (
            <Row>
              {["Title", "Genre", "Musician"].map((field) => (
                <React.Fragment key={field}>
                  <CustomInput
                    set={set}
                    get={get}
                    field={field}
                    func={handleSearch}
                    size={2}
                  />
                  <Col className="col">
                    <CustomButton
                      field={field}
                      IconButton={MdCancel}
                      func={handleCancelSearch}
                      title={`Cancel Search with ${field}`}
                      id={`${field}-filter`}
                    />
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          )}

          <Row />
          <Row>
            <Col />
            <Col />
            <Col>
              <CustomButton
                IconButton={BsSearchHeart}
                func={handleSearch}
                title={"Search Song"}
                id="search"
              />
            </Col>
            <Col>
              <CustomButton
                field="all"
                IconButton={MdOutlineSearchOff}
                func={handleCancelSearch}
                title={"Cancel Search All filter"}
                id="cancel-search"
                size={50}
              />
            </Col>
            <Col>
              <CustomButton
                IconButton={RiHeartAddFill}
                func={handleNewSong}
                title={"Add new Song"}
                id="new-song"
              />
            </Col>
            <Col />
            <Col />
          </Row>
        </Form>
        {handleAudioPlayerUpdate()}
        <CustomButton
          style={{ position: "absolute", top: "90%", left: "95%" }}
          IconButton={BsArrowsExpand}
          color={"rgba(255,255,255,0.5)"}
          size={20}
          func={() => handleExpandFilter()}
          id="expand-filter"
          title={expandFilter === 55 ? "Expand" : "UnExpanded"}
        />
      </Container>
      <Container
        style={{
          marginTop: isAdmin ? 350 : 300,
          overflow: "hidden",
        }}
        className={`filter-container ${
          expandFilter ? (isAdmin ? "expanded-no-admin" : "expanded-admin") : ""
        }`}
      >
        <Table
          striped
          bordered
          style={{
            borderWidth: "0px 0",
          }}
        >
          <colgroup>
            <col width="60" span="1" />
            <col width="auto" span="3" />
            <col
              width={
                JSON.parse(sessionStorage.getItem("isRevoked")) || isLoggedIn
                  ? "110"
                  : "70"
              }
              span="1"
            />
          </colgroup>
          <thead className="table-dark ">
            <tr>
              {!isAdmin && <th>STT</th>}
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
              ]
                .filter((obj) => isAdmin || obj.field !== "ID")
                .map((row) => {
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
            {currentSongs.map((song, index) => (
              <tr
                onContextMenu={(event) => handleContextMenu(event, song.id)}
                style={{
                  backgroundColor:
                    currentSongPlaying === song.id &&
                    window.location.search ===
                      sessionStorage.getItem("urlPlayingList")
                      ? "rgba(255,255,255,0.5)"
                      : "transparent",
                }}
                key={song.id}
              >
                {!isAdmin && <td>{index + 1}</td>}
                {isAdmin && <td>{song.id}</td>}
                <td style={{ textAlign: "left" }}>{song.title}</td>
                <td>{song.genre}</td>
                <td style={{ textAlign: "left" }}>{song.musician}</td>
                <td>
                  <CustomButton
                    field={song.id}
                    IconButton={
                      currentSongPlaying !== song.id ||
                      !isPlaying ||
                      window.location.search !==
                        sessionStorage.getItem("urlPlayingList")
                        ? AiOutlinePlayCircle
                        : AiOutlinePauseCircle
                    }
                    size={30}
                    func={() => handlePlaySong(song)}
                    title={
                      currentSongPlaying !== song.id ||
                      !isPlaying ||
                      window.location.search !==
                        sessionStorage.getItem("urlPlayingList")
                        ? "Play"
                        : "Pause"
                    }
                    id={`play-pause-${song.id}`}
                  />
                  {(JSON.parse(sessionStorage.getItem("isRevoked")) ||
                    isLoggedIn) &&
                    (isAdmin || location.pathname === "/my_songs") && (
                      <>
                        <CustomButton
                          field={song.id}
                          IconButton={AiOutlineEdit}
                          size={30}
                          func={handleUpdateSong}
                          title={"Edit Song"}
                          id={`edit-song-${song.id}`}
                        />
                        <CustomButton
                          field={song.id}
                          IconButton={AiOutlineDelete}
                          size={30}
                          func={handleDeleteSong}
                          title={"Delete Song"}
                          id={`delete-song-${song.id}`}
                        />
                      </>
                    )}
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
          totalPages={totalPages === 0 ? 1 : totalPages}
          objectsPerPage={get("limit")}
        />
      </Row>
    </div>
  );
}

export default Songs;
