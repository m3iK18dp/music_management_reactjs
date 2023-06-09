/* eslint-disable react-hooks/exhaustive-deps */
import "../css/songs.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import { BiLeftArrow } from "react-icons/bi";
import {
  BsSearchHeart,
  BsSortNumericUpAlt,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortAlphaDownAlt,
  BsArrowsExpand,
  BsFileEarmarkMusic,
  BsMusicNoteList,
} from "react-icons/bs";
import { MdCancel, MdOutlineCancel } from "react-icons/md";
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
import CustomContextMenu from "../components/contextMenu/CustomContextMenu";
import playlistService from "../services/PlayListService";
import { IoMdAdd } from "react-icons/io";
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
  const isLoggedIn = localStorage.getItem("token");
  // &&
  // !JSON.parse(sessionStorage.getItem('isRevoked'));
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
    // owner_email:
    //   location.pathname === "/my_songs"
    //     ? sessionStorage.getItem("username")
    //     : "",
    // playlist_id: location.pathname.includes("my_playlist")
    //   ? prams.playlist_id
    //   : "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [currentSongPlaying, setCurrentSongPlaying] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [expandFilter, setExpandFilter] = useState(false);
  const [playlists, setPlaylists] = useState([]);
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
    document.title = "Songs manager";
    checkToken(navigate, 0);
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    if (location.pathname === "/my_songs")
      params._owner_email = sessionStorage.getItem("username");
    if (location.pathname.includes("my_playlist")) {
      // if (JSON.parse(sessionStorage.getItem("isRevoked")))
      //   navigate("/error/403");
      params._playlist_id = prams.playlist_id;
    }
    [
      { field: "id", default: "" },
      { field: "title", default: "" },
      { field: "genre", default: "" },
      { field: "musician", default: "" },
      { field: "page", default: 0 },
      { field: "limit", default: 10 },
      { field: "field", default: isAdmin ? "id" : "title" },
      { field: "type_sort", default: "asc" },
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
      if (isLoggedIn)
        playlistService
          .get({ _owner_email: sessionStorage.getItem("username") })
          .then((data) => {
            setPlaylists(data.data.content);
            if (
              location.pathname.includes("my_playlist") &&
              !data.data.content.find(
                (pl) => parseInt(pl.id) === parseInt(prams.playlist_id)
              )
            )
              navigate("/error/403");
          });
      if (currentSongPlaying === -1) {
        setCurrentSongPlaying(
          data.data.content.length !== 0 ? data.data.content[0].id : -1
        );
        sessionStorage.setItem(
          "urlPlayingList",
          location.pathname + location.search
        );
        sessionStorage.setItem(
          "currentSongsPlaying",
          JSON.stringify(data.data.content)
        );
      }
    });
  }, [window.location.href]);
  // const handleChosePlaylist = () => {};
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
  const handlePlaySong = (id) => {
    setCurrentSongPlaying(id);
    handleAudioPlayerUpdate(currentSongs, 1);
    sessionStorage.setItem("currentSongsPlaying", JSON.stringify(currentSongs));
    sessionStorage.setItem(
      "urlPlayingList",
      location.pathname + location.search
    );
    if (currentSongPlaying !== id) {
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
  const [contextMenuPosition, setContextMenuPosition] = useState({
    id: -1,
    visible: false,
    playlists: [],
  });
  useEffect(() => {
    setContextMenuPosition(
      playlists.length > contextMenuPosition.playlists.length
        ? {
            ...contextMenuPosition,
            playlists: playlists,
          }
        : { ...contextMenuPosition, visible: false }
    );
  }, [playlists]);
  const handleContextMenu = (event, id, type = "song") => {
    if (id !== -1 || (id === -1 && type.includes("playlist"))) {
      event.stopPropagation();
    }
    event.preventDefault();
    setContextMenuPosition({
      x: event.pageX,
      y: event.pageY,
      playlists: playlists,
      setPlaylists: setPlaylists,
      id: id,
      navigate: navigate,
      handleAddPlaylist: handleAddPlaylist,
      handleUpdatePlaylist: handleUpdatePlaylist,
      handleDeletePlaylist: handleDeletePlaylist,
      handlePlaySong: handlePlaySong,
      handleNewSong: handleNewSong,
      handleUpdateSong: handleUpdateSong,
      handleDeleteSong: handleDeleteSong,
      addSongToPlaylist: addSongToPlaylist,
      deleteSongInPlaylist: deleteSongInPlaylist,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      location: location,
      prams: prams,
      type: type,
      visible: true,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition({
      visible: false,
      playlists: [],
    });
  };
  const [playlist, setPlaylist] = useState({ name: "" });

  const setPl = (prop, value) => {
    setPlaylist({ ...playlist, [prop]: value });
  };
  const getPl = (field) => {
    return playlist[field];
  };
  const [showFormAddPlaylist, setShowFormAddPlaylist] = useState(false);
  const handleAddPlaylist = () => {
    if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else setShowFormAddPlaylist(!showFormAddPlaylist);
  };
  const addPlaylist = () => {
    playlistService.insertPlaylist(playlist, navigate).then((res) => {
      if (res.status === "ok") {
        setPlaylists([...playlists, res.data]);
        handleAddPlaylist();
        setPlaylist({ name: "" });
        handleAddPlaylist();
      } else alert(res.message);
    });
  };
  const [showUpdatePlaylistFrom, setShowUpdatePlaylistFrom] = useState(-1);
  const handleUpdatePlaylist = (id) => {
    if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else {
      if (id !== -1) setShowUpdatePlaylistFrom(id);
      else setShowUpdatePlaylistFrom(-1);
    }
  };
  const updatePlaylist = (id, playlist, navigate) => {
    playlistService.updatePlayList(id, playlist, navigate).then((res) => {
      if (res.status === "ok") {
        playlists.forEach((playlist) => {
          if (playlist.id === id) playlist.name = res.data.name;
        });
        setPlaylists([...playlists]);
        handleUpdatePlaylist();
      } else alert(res.message);
    });
  };
  const handleDeletePlaylist = (id, navigate) => {
    if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else if (window.confirm("Do you want to delete this playlist?")) {
      playlistService.deletePlaylist(id, navigate).then((res) => {
        if (res.status === "ok") {
          setPlaylists(playlists.filter((playlist) => playlist.id !== id));
          if (parseInt(prams.playlist_id) === id)
            navigate("/songs" + location.search);
        } else alert(res.message);
      });
    }
  };
  const addSongToPlaylist = (playlistId, id) => {
    if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else
      playlistService
        .addSongToPlayList(playlistId, id, navigate)
        .then((res) => {
          if (res.status === "ok") {
            // setPlaylists([...playlists, res.data]);
            alert("Add song to playlist success.");
          } else alert(res.message);
        });
  };
  const deleteSongInPlaylist = (playlistId, id) => {
    if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
      alert(alertRevoked);
    } else
      playlistService
        .deleteSongInPlaylist(playlistId, id, navigate)
        .then((res) => {
          if (res.status === "ok") {
            // setPlaylists([...playlists, res.data]);
            setCurrentSongs(currentSongs.filter((song) => song.id !== id));
            alert("Delete song in this playlist success.");
          } else alert(res.message);
        });
  };
  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onClick={handleCloseContextMenu}
      onContextMenu={(event) => handleContextMenu(event, -1)}
    >
      {/* /////////////////////////////////////// */}
      {contextMenuPosition.visible && (
        <CustomContextMenu {...contextMenuPosition} />
      )}
      <div className="background-container" />
      <div className=" background-container-opacity-low" />
      <NavbarComponent />{" "}
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
        }}
        className={`background-color filter-container ${
          expandFilter ? (isAdmin ? "expanded-no-admin" : "expanded-admin") : ""
        }`}
      >
        <Form
          style={{
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
            {/* <Col /> */}
            <Col>
              <label className="neon" style={{ color: "white" }}>
                Search
              </label>
              <CustomButton
                IconButton={BsSearchHeart}
                func={handleSearch}
                title={"Search Song"}
                id="search"
              />
            </Col>
            <Col>
              <label className="neon" style={{ color: "white" }}>
                Cancel Search
              </label>
              <CustomButton
                field="all"
                IconButton={MdOutlineSearchOff}
                func={handleCancelSearch}
                title={"Cancel Search All filter"}
                id="cancel-search"
                size={50}
              />
            </Col>
            {/* <Col>
							<CustomButton
								IconButton={RiHeartAddFill}
								func={handleNewSong}
								title={'Add new Song'}
								id='new-song'
							/>
						</Col> */}
            {/* <Col /> */}
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
      <div
        style={{
          position: "relative",
          width: "100%",
          height: `calc(100% - ${isAdmin ? 410 : 360}px)`,
          display: "flex",
          alignContent: "flex-start",
        }}
      >
        {isLoggedIn && (
          <>
            <Container
              onContextMenu={(event) => {
                handleContextMenu(event, -1, "playlist");
              }}
              style={{
                display: "block",
                position: "fixed",
                backgroundColor: "rgba(255,255,255,0.2)",
                width: "15%",
                // height: 'auto',
                maxWidth: 150,
                minWidth: 120,
                margin: 0,
                top: isAdmin ? 360 : 310,
                height: `calc(100% - ${
                  isAdmin
                    ? 410 - (expandFilter ? 155 : 0)
                    : 360 - (expandFilter ? 130 : 0)
                }px)`,
                // height: '100%',
                // paddingTop: isAdmin ? 360 : 310,
                // marginBottom: 50,
                overflow: "auto",
                padding: 0,
                // justifyContent: "center",
              }}
              className={`filter-container ${
                expandFilter
                  ? isAdmin
                    ? "expanded-no-admin"
                    : "expanded-admin"
                  : ""
              }`}
            >
              <div style={{ padding: 10 }}>
                <Link
                  to={`/songs${location.search}`}
                  className="flex neon"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    height: "40px",
                  }}
                >
                  <BsMusicNoteList size={20}></BsMusicNoteList>
                  <h6
                    style={{
                      margin: "20px 0 20px 0",
                      padding: 0,
                      display: "inline",
                    }}
                  >
                    All Songs
                  </h6>
                </Link>
                <Link
                  to={`/my_songs${location.search}`}
                  className="flex neon"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    height: "40px",
                  }}
                >
                  <BsFileEarmarkMusic size={20}></BsFileEarmarkMusic>
                  <h6
                    style={{
                      margin: "20px 0 20px 0",
                      padding: 0,
                      display: "inline",
                    }}
                  >
                    My Songs
                  </h6>
                </Link>
              </div>
              <div
                style={{ borderTop: "4px dashed rgba(255,255,255,0.6)" }}
              ></div>
              <div className="playlist-context" style={{ padding: 10 }}>
                <div className="flex neon">
                  <h6
                    style={{
                      fontWeight: "bold",
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: 10,
                    }}
                  >
                    My Play List
                  </h6>
                </div>

                {showFormAddPlaylist && (
                  <>
                    <input
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        // event.stopPropagation();
                        setPl("name", event.target.value);
                      }}
                      style={{ width: "100%", fontSize: "12px" }}
                      value={getPl("name")}
                      onKeyDown={(event) => {
                        console.log(event.key);
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addPlaylist();
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          setPlaylist({ name: "" });
                          handleAddPlaylist();
                        }
                      }}
                      placeholder="Enter name playlist"
                    ></input>
                    <div className="flex">
                      <CustomButton
                        IconButton={IoMdAdd}
                        func={addPlaylist}
                        size={20}
                        id="esc-add-playlist"
                      />
                      <CustomButton
                        IconButton={MdOutlineCancel}
                        func={() => {
                          setPlaylist({ name: "" });
                          handleAddPlaylist();
                        }}
                        size={20}
                        id="add-playlist"
                      />
                    </div>
                  </>
                )}
                {playlists.map((playlist) =>
                  showUpdatePlaylistFrom === playlist.id ? (
                    <div key={"playlist-" + playlist.id}>
                      <input
                        onClick={(event) => event.stopPropagation()}
                        style={{ width: "100%", fontSize: "12px" }}
                        defaultValue={playlist.name}
                        onKeyDown={(event) => {
                          console.log(event.key);
                          if (event.key === "Enter") {
                            event.preventDefault();
                            updatePlaylist(
                              playlist.id,
                              { name: event.target.value },
                              navigate
                            );
                          }
                          if (event.key === "Escape") {
                            event.preventDefault();
                            setPlaylist({ name: "" });
                            handleUpdatePlaylist();
                          }
                        }}
                        placeholder="Enter name playlist"
                      ></input>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        // if (JSON.parse(sessionStorage.getItem("isRevoked"))) {
                        //   alert(alertRevoked);
                        // } else
                        if (parseInt(prams.playlist_id) !== playlist.id)
                          navigate(
                            `/my_playlist/${playlist.id}${location.search}`
                          );
                      }}
                      key={"playlist-" + playlist.id}
                      className="context-menu-row flex"
                      onContextMenu={(event) =>
                        handleContextMenu(event, playlist.id, "playlist")
                      }
                      style={
                        parseInt(prams.playlist_id) === playlist.id
                          ? {
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                            }
                          : {}
                      }
                    >
                      <h6
                        style={
                          parseInt(prams.playlist_id) === playlist.id
                            ? {
                                color: "rgba(0, 0, 0, 0.6)",
                              }
                            : { color: "white" }
                        }
                      >
                        {playlist.name}
                      </h6>
                    </div>
                  )
                )}
              </div>
            </Container>
            <Container
              style={{
                visibility: "hidden",
                display: "block",
                backgroundColor: "rgba(255,255,255,0.2)",
                width: "15%",
                maxWidth: 150,
                minWidth: 120,
                margin: 0,
                top: isAdmin ? 360 : 310,
                height: `calc(100% - ${
                  isAdmin
                    ? 410 - (expandFilter ? 155 : 0)
                    : 360 - (expandFilter ? 130 : 0)
                }px)`,
                overflow: "auto",
                padding: 0,
              }}
              className={`filter-container ${
                expandFilter
                  ? isAdmin
                    ? "expanded-no-admin"
                    : "expanded-admin"
                  : ""
              }`}
            >
              <div className="playlist-context">
                <div>
                  <Link
                    to={`/songs${location.search}`}
                    className="flex neon"
                    style={{
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    <BiLeftArrow size={25}></BiLeftArrow>
                    <h5
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,1)",
                        margin: "20px 0 20px 0",
                        padding: 0,
                        display: "inline",
                      }}
                    >
                      All Songs
                    </h5>
                  </Link>
                </div>
                <h5
                  style={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.7)",
                    borderBottom: "1px solid rgba(255,255,255,0.6)",
                    marginTop: 10,
                  }}
                >
                  My Play List
                </h5>
                {showFormAddPlaylist && (
                  <>
                    <input
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        // event.stopPropagation();
                        setPl("name", event.target.value);
                      }}
                      style={{ width: "100%", fontSize: "12px" }}
                      value={getPl("name")}
                      onKeyDown={(event) => {
                        console.log(event.key);
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addPlaylist();
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          setPlaylist({ name: "" });
                          handleAddPlaylist();
                        }
                      }}
                      placeholder="Enter name playlist"
                    ></input>
                    <div className="flex">
                      <CustomButton
                        IconButton={IoMdAdd}
                        func={addPlaylist}
                        size={20}
                        id="esc-add-playlist"
                      />
                      <CustomButton
                        IconButton={MdOutlineCancel}
                        func={() => {
                          setPlaylist({ name: "" });
                          handleAddPlaylist();
                        }}
                        size={20}
                        id="add-playlist"
                      />
                    </div>
                  </>
                )}
                {playlists.map((playlist) =>
                  showUpdatePlaylistFrom === playlist.id ? (
                    <div key={"playlist-" + playlist.id}>
                      <input
                        onClick={(event) => event.stopPropagation()}
                        style={{ width: "100%", fontSize: "12px" }}
                        defaultValue={playlist.name}
                        onKeyDown={(event) => {
                          console.log(event.key);
                          if (event.key === "Enter") {
                            event.preventDefault();
                            updatePlaylist(
                              playlist.id,
                              { name: event.target.value },
                              navigate
                            );
                          }
                          if (event.key === "Escape") {
                            event.preventDefault();
                            setPlaylist({ name: "" });
                            handleUpdatePlaylist();
                          }
                        }}
                        placeholder="Enter name playlist"
                      ></input>
                    </div>
                  ) : (
                    <div
                      key={"playlist-" + playlist.id}
                      className="context-menu-row flex"
                      onContextMenu={(event) =>
                        handleContextMenu(event, playlist.id, "playlist")
                      }
                    >
                      <Link
                        to={`/my_playlist/${playlist.id}${location.search}`}
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        <h6>{playlist.name}</h6>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </Container>
          </>
        )}
        <Container
          // onContextMenu={(event) => handleContextMenu(event, -1, 'song')}
          style={{
            marginTop: isAdmin ? 350 : 300,
            width: "85%",
            marginLeft: "auto",

            // marginBottom: 50,
            // overflow: "auto",
          }}
          className={`filter-container ${
            expandFilter
              ? isAdmin
                ? "expanded-no-admin"
                : "expanded-admin"
              : ""
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
              {/* <col
								width={
									JSON.parse(sessionStorage.getItem('isRevoked')) || isLoggedIn
										? '110'
										: '70'
								}
								span='1'
							/> */}
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
                {/* <th className='column-'>Actions</th> */}
              </tr>
            </thead>
            {currentSongs.length !== 0 && (
              <tbody>
                {currentSongs.map((song, index) => (
                  <tr
                    onContextMenu={(event) => handleContextMenu(event, song.id)}
                    style={{
                      backgroundColor:
                        currentSongPlaying === song.id &&
                        location.pathname + location.search ===
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
                    {/* <td>
											<CustomButton
												field={song.id}
												IconButton={
													currentSongPlaying !== song.id ||
													!isPlaying ||
													location.pathname + location.search !==
														sessionStorage.getItem('urlPlayingList')
														? AiOutlinePlayCircle
														: AiOutlinePauseCircle
												}
												size={30}
												func={() => handlePlaySong(song.id)}
												title={
													currentSongPlaying !== song.id ||
													!isPlaying ||
													location.pathname + location.search !==
														sessionStorage.getItem('urlPlayingList')
														? 'Play'
														: 'Pause'
												}
												id={`play-pause-${song.id}`}
											/>
											{(JSON.parse(sessionStorage.getItem('isRevoked')) ||
												isLoggedIn) &&
												(isAdmin || location.pathname === '/my_songs') && (
													<>
														<CustomButton
															field={song.id}
															IconButton={AiOutlineEdit}
															size={30}
															func={handleUpdateSong}
															title={'Edit Song'}
															id={`edit-song-${song.id}`}
														/>
														<CustomButton
															field={song.id}
															IconButton={AiOutlineDelete}
															size={30}
															func={handleDeleteSong}
															title={'Delete Song'}
															id={`delete-song-${song.id}`}
														/>
													</>
												)}
										</td> */}
                  </tr>
                ))}
              </tbody>
            )}
          </Table>{" "}
          {currentSongs.length === 0 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                color: "white",
              }}
            >
              Empty search song list
            </div>
          )}{" "}
          <div style={{ visibility: "hidden", height: 50 }} />
        </Container>{" "}
      </div>
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
