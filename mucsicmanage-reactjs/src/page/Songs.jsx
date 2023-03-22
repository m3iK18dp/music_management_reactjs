/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsPlayCircle, BsSearchHeart, BsPauseCircle } from "react-icons/bs";
import { RiHeartAddFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import PaginationComponent from "../components/PaginationComponent";
import NavbarComponent from "../components/NavbarComponent";
import songService from "../services/SongService";
// import ReactHowler from "react-howler";
// import { Howl } from "howler";
// import AudioPlayer from "../components/AudioPlayer";
// import ReactAudioPlayer from "react-audio-player";

function Songs() {
  // roles();
  const searchParams = useLocation().search.slice(1).split("=");
  const [search, setSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage, setSongsPerPage] = useState(10);
  const [songs, setSongs] = useState([]);
  const [currentSongPlay, setCurrentSongPlay] = useState();
  const [currentSongPlayUrl, setCurrentSongPlayUrl] = useState("");
  // const [playing, setPlaying] = useState(false);
  const [playList, setPlayList] = useState([
    "https://res.cloudinary.com/dx2nrp7at/video/upload/v1678953974/MusicManager/4107ac7b-e201-4564-9a94-e9504bd5c54c.mp3",
    "https://res.cloudinary.com/dx2nrp7at/video/upload/v1678863522/MusicManager/cd7135a3-d220-4245-89c1-ed638ca1504e.mp3",
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audio = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    if (searchParams.length === 2) {
      searchParams[1] = decodeURIComponent(searchParams[1]);
      setSearch(searchParams[1]);
      setTypeSearch(searchParams[0]);
    }
    const searchQuery = {};
    searchQuery["_" + searchParams[0]] = searchParams[1];
    songService.get(searchQuery).then((data) => {
      setSongs(data.data.content);
    });
  }, [searchParams[0], searchParams[1]]);
  const handlePlaySong = (id, url) => {
    if (currentSongPlay !== id) {
      setCurrentSongPlay(id);
      setCurrentSongPlayUrl(url);
      // const myAudio = new Howl({
      // 	src: [url],
      // });
      // setDuration(myAudio.duration());
      // console.log('Audio duration:', duration);
      handlePlay();
    } else {
      setCurrentSongPlay("");
      // setCurrentSongPlayUrl('');
      handlePause();
    }
  };
  const handleSearch = () => {
    if (search !== "") navigate(`/songs?${typeSearch}=${search}`);
  };
  const handleCancelSearch = () => {
    if (search !== "") {
      setSearch("");
      setTypeSearch("title");
      navigate(`/songs`);
    }
  };
  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete this song?")) {
      songService.deleteSong(id);
      setSongs(songs.filter((song) => song.id !== id));
    }
  };
  const handlePlay = () => {
    console.log(audio);
    audio.current.play();
  };

  const handlePause = () => {
    audio.current.pause();
  };

  const previousSong = () => {
    const newIndex = (currentSongIndex + playList.length - 1) % playList.length;
    setCurrentSongIndex(newIndex);
    setCurrentSongPlayUrl();
  };

  const nextSong = () => {
    const newIndex =
      (this.state.currentSongIndex + 1) % this.state.playlist.length;
    setCurrentSongIndex(newIndex);
    setCurrentSongPlayUrl();
  };
  const totalPages = Math.ceil(songs.length / songsPerPage);
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  return (
    <>
      <NavbarComponent />
      <Container fluid style={{ marginTop: 80 }}>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  name={typeSearch}
                  placeholder={search ? search : "Enter Search"}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  as="select"
                  value={typeSearch}
                  onChange={(event) => setTypeSearch(event.target.value)}
                >
                  <option value="title">Title</option>
                  <option value="musician">Musician</option>
                  <option value="genre">Genre</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col>
              <a
                onClick={handleSearch}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Search Song"
              >
                <BsSearchHeart size={40} color="black"></BsSearchHeart>
              </a>

              <a
                onClick={handleCancelSearch}
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Cancel Search"
              >
                <MdCancel size={40} color="black"></MdCancel>
              </a>
              <a
                href="/songs/new"
                onMouseOver={(e) => {
                  e.target.style.color = "rgb(40, 144, 144)";
                  e.target.style.cursor = "pointer";
                }}
                onMouseOut={(e) => (e.target.style.color = "black")}
                title="Add new Song"
              >
                <RiHeartAddFill size={40} color="black"></RiHeartAddFill>
              </a>
            </Col>
          </Row>
        </Form>
        <div>
          <audio
            src={currentSongPlayUrl}
            controls
            autoPlay
            style={{ width: "70%", display: "block", margin: "20px auto" }}
            onPlay={false}
            ref={audio}
          />
          <Button onClick={handlePlay}>Play</Button>
          <Button onClick={handlePause}>Pause</Button>
          <Button onClick={previousSong}>Previous</Button>
          <Button onClick={nextSong}>Next</Button>
        </div>

        <Table striped bordered>
          <colgroup>
            <col width="30" span="1" />
            <col width="auto" span="3" />
            <col width="150" span="1" />
          </colgroup>
          <thead className="table-dark">
            <tr>
              <th>STT</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Musician</th>
              <th className="column-">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSongs.map((song, index) => (
              <tr key={song.id}>
                <td>{index + 1}</td>
                <td>
                  <a>{song.title}</a>
                </td>
                <td>{song.genre}</td>
                <td>{song.musician}</td>
                <td>
                  <div>
                    <a
                      onClick={() => handlePlaySong(song.id, song.url)}
                      style={{ marginRight: "15px" }}
                      onMouseOver={(e) => {
                        e.target.style.color = "rgb(40, 144, 144)";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      {currentSongPlay !== song.id && (
                        <BsPlayCircle
                          size={30}
                          color="black"
                          variant="primary"
                        />
                      )}
                      {currentSongPlay === song.id && (
                        <BsPauseCircle
                          size={30}
                          color="black"
                          variant="primary"
                        />
                      )}
                    </a>
                    <a
                      href={`/songs/${song.id}`}
                      style={{ marginRight: "15px" }}
                      onMouseOver={(e) => {
                        e.target.style.color = "rgb(40, 144, 144)";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      <AiOutlineEdit
                        size={30}
                        color="black"
                        variant="primary"
                      />
                    </a>
                    <a
                      onClick={() => handleDelete(song.id)}
                      style={{ marginRight: 0 }}
                      onMouseOver={(e) => {
                        e.target.style.color = "red";
                        e.target.style.cursor = "pointer";
                      }}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      <AiOutlineDelete
                        size={30}
                        color="black"
                        variant="danger"
                      />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row>
          <PaginationComponent
            currentPage={currentPage} // trang hiện tại
            totalPages={totalPages} // tổng số trang
            setCurrentPage={setCurrentPage} // hàm set trang hiện tại
            songsPerPage={songsPerPage} // số lượng mục hiển thị trên mỗi trang
            setSongsPerPage={setSongsPerPage} // hàm set số lượng mục hiển thị trên mỗi trang
          />
        </Row>
      </Container>
    </>
  );
}

export default Songs;
