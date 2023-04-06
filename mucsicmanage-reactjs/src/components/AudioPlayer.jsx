import React, { useState } from "react";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { AiOutlineDownload } from "react-icons/ai";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { TfiControlBackward, TfiControlForward } from "react-icons/tfi";
import {
  TbRepeatOnce,
  TbRepeat,
  TbRepeatOff,
  TbArrowsShuffle2,
} from "react-icons/tb";
import { RiPlayListLine } from "react-icons/ri";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import "../css/songs.css";
import { Row, Col } from "react-bootstrap";

import CustomButton from "../components/CustomButton";
import "../css/audioPlayer.css";
import { useNavigate } from "react-router";

function MusicPlayer({
  songs,
  setIsPlaying,
  isPlaying,
  setCurrentSongPlaying,
  currentSongPlaying,
  audioRef,
  handleCancelSearch,
  style,
}) {
  const navigate = useNavigate();
  const [showChangeVolume, setShowChangeVolume] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // const [playbackRate, setPlaybackRate] = useState(1);

  const [isShuffle, setIsShuffle] = useState(false);
  const [repeat, setRepeat] = useState("none");
  /////
  // let historyPlay = [currentSongPlaying];
  // if (sessionStorage.getItem('historyPlay')) {
  // 	historyPlay = sessionStorage.getItem('historyPlay');
  // 	console.log(historyPlay);
  // 	historyPlay = Array.from(historyPlay).push(currentSongPlaying);
  // }
  // sessionStorage.setItemItem('historyPlay', historyPlay);
  /////
  const getCurrentSongPlayingIndex = () => {
    return songs.findIndex((song) => song.id === currentSongPlaying);
  };
  const handlePlay = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };
  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };
  const handleRepeat = () => {
    const typeRepeat = ["none", "all", "one"];
    setRepeat(
      typeRepeat[(typeRepeat.findIndex((type) => type === repeat) + 1) % 3]
    );
  };
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  const handleDurationChange = () => {
    setDuration(audioRef.current.duration);
  };
  const handleNextSong = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongPlaying(songs[randomIndex].id);
      // sessionStorage.setItem(
      //   "currentSongsPlaying",
      //   JSON.stringify([songs[randomIndex]])
      // );
    } else {
      const newIndex =
        (songs.findIndex((song) => song.id === currentSongPlaying) +
          songs.length +
          1) %
        songs.length;
      setCurrentSongPlaying(songs[newIndex].id);
      // sessionStorage.setItem(
      //   "currentSongsPlaying",
      //   JSON.stringify([songs[newIndex]])
      // );
    }
  };
  const handlePrevSong = () => {
    const newIndex =
      (songs.findIndex((song) => song.id === currentSongPlaying) +
        songs.length -
        1) %
      songs.length;
    if ((newIndex >= 0) & (newIndex < songs.length)) {
      // set("currentSongPlayingUrl", songs[newIndex].url);
      setCurrentSongPlaying(songs[newIndex].id);
      // sessionStorage.setItem(
      //   "currentSongPlaying",
      //   JSON.stringify([songs[newIndex]])
      // );
    }
  };
  // const handleStart = () => {
  // 	setCurrentTime(0);
  // 	audioRef.current.currentTime = 0;
  // };

  const handleEnd = () => {
    setCurrentTime(0);
    if (
      repeat === "none" &&
      getCurrentSongPlayingIndex() === songs.length - 1
    ) {
      setIsPlaying(false);
    } else if (repeat === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else handleNextSong();
  };
  // const handlePlaybackRateChange = (event) => {
  // 	const rate = parseFloat(event.target.value);
  // 	setPlaybackRate(rate);
  // 	audioRef.current.playbackRate = rate;
  // };
  const handleVolumeChange = (event) => {
    const volume = parseFloat(event.target.value);
    setVolume(volume);
    audioRef.current.volume = volume;
  };
  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };
  const handleMute = () => {
    if (volume !== 0) {
      sessionStorage.setItem("oldVolume", volume);
      audioRef.current.volume = 0;
      setVolume(0);
    } else {
      audioRef.current.volume = parseFloat(sessionStorage.getItem("oldVolume"));
      setVolume(parseFloat(sessionStorage.getItem("oldVolume")));
    }
  };
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = `${minutes}`.padStart(2, "0");
    const formattedSeconds = `${remainingSeconds}`.padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  //   console.log(JSON.parse(sessionStorage.getItem("currentSongPlaying")));
  return (
    <div style={style}>
      <audio
        src={
          songs[getCurrentSongPlayingIndex()]
            ? songs[getCurrentSongPlayingIndex()].url
            : ""
        }
        autoPlay={isPlaying}
        ref={audioRef}
        onEnded={handleEnd}
        onDurationChange={handleDurationChange}
        onTimeUpdate={handleTimeUpdate}
        // playbackRate={playbackRate}
        volume={volume}
      />
      <Row style={{ height: 41 }}>
        <Col className="col" xs={1}>
          {songs[getCurrentSongPlayingIndex()] && (
            <h6
              style={{
                fontStyle: "italic",
                fontWeight: "bold",
                margin: 0,
                padding: 0,
                color: "rgba(140,240,190,0.6)",
              }}
            >
              Now Playing:
            </h6>
          )}
        </Col>
        <Col className="col" xs={10}>
          <h2
            className=" neon"
            style={{
              margin: 0,
              padding: 0,
              color: "rgba(255,255,255,0.6)",
              fontWeight: "bold",
            }}
          >
            {!songs[getCurrentSongPlayingIndex()]
              ? ""
              : `${songs[getCurrentSongPlayingIndex()].title} - ${
                  songs[getCurrentSongPlayingIndex()].musician
                }`}
          </h2>
        </Col>
        <Col className="col" xs={1}>
          {songs[getCurrentSongPlayingIndex()] && (
            <CustomButton
              IconButton={RiPlayListLine}
              color={"rgba(255,255,255,0.6)"}
              size={30}
              func={() =>
                sessionStorage.getItem("urlPlayingList") === ""
                  ? handleCancelSearch("all")
                  : navigate(sessionStorage.getItem("urlPlayingList"))
              }
              disable={
                sessionStorage.getItem("urlPlayingList") ===
                window.location.search
              }
              title="Show Playing List"
            />
          )}
        </Col>
      </Row>
      <Row
        style={{
          marginTop: 0,
          marginBottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col
          xs={2}
          style={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <CustomButton
            IconButton={AiOutlineDownload}
            size={30}
            func={() =>
              fetch(audioRef.current.src)
                .then((response) => response.blob())
                .then(async (blob) => {
                  const handle = await window.showSaveFilePicker({
                    suggestedName: `${
                      songs[getCurrentSongPlayingIndex()].title
                    }`,
                    types: [
                      {
                        description: "MP3 audio file",
                        accept: { "audio/mpeg": [".mp3"] },
                      },
                      {
                        description: "WAV audio file",
                        accept: { "audio/wav": [".wav"] },
                      },
                      {
                        description: "FLAC audio file",
                        accept: { "audio/flac": [".flac"] },
                      },
                    ],
                  });
                  const writable = await handle.createWritable();
                  await writable.write(blob);
                  await writable.close();
                })
            }
            color={"white"}
            id="download"
          />
        </Col>
        <Col>
          <span>{formatTime(currentTime)}</span>
          <input
            id="rangeAudio"
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(event) => {
              setCurrentTime(parseFloat(event.target.value));
              audioRef.current.currentTime = parseFloat(event.target.value);
            }}
          />
          <span>{formatTime(duration)}</span>
        </Col>
        <Col
          xs={2}
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
          onMouseOver={(e) => {
            e.target.style.cursor = "pointer";
            setShowChangeVolume(true);
          }}
          onMouseOut={(e) => {
            setShowChangeVolume(false);
          }}
        >
          <CustomButton
            IconButton={volume === 0 ? CiVolumeMute : CiVolumeHigh}
            size={30}
            func={handleMute}
            color={"white"}
            // onMouseOverFunc={() => setShowChangeVolume(true)}
            // onMouseOutFunc={() => setShowChangeVolume(false)}
            id="mute"
          />

          <input
            id="rangeVolume"
            style={{ visibility: !showChangeVolume ? "hidden" : "" }}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </Col>
      </Row>
      <Row className="controls-audio">
        <Col />
        <Col className="control">
          <CustomButton
            IconButton={TbArrowsShuffle2}
            size={25}
            func={handleShuffle}
            title={isShuffle ? "Shuffle Enabled" : "Shuffle Disabled"}
            color={isShuffle ? "rgba(52,81,76,0.9)" : "rgba(52,81,76,0.3)"}
            id="shuffle"
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={MdReplay10}
            size={25}
            func={() => (audioRef.current.currentTime -= 10)}
            title={"Replay 10s"}
            color={`rgba(52,81,76,0.9)`}
            id="replay"
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={TfiControlBackward}
            size={25}
            func={handlePrevSong}
            title={"Prev Song"}
            color={"rgba(52,81,76,0.9)"}
            id="step-backward"
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={!isPlaying ? CiPlay1 : CiPause1}
            size={30}
            func={!isPlaying ? handlePlay : handlePause}
            title={!isPlaying ? "Play" : "Pause"}
            color={"rgba(52,81,76,0.9)"}
            id="play-pause"
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={TfiControlForward}
            size={25}
            func={handleNextSong}
            title={"Next Song"}
            color={"rgba(52,81,76,0.9)"}
            id="step-forward"
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={MdForward10}
            size={25}
            func={() => (audioRef.current.currentTime += 10)}
            title={"Forward 10s"}
            color={`rgba(52,81,76,0.9)`}
            id="forward"
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={
              repeat === "one"
                ? TbRepeatOnce
                : repeat === "all"
                ? TbRepeat
                : TbRepeatOff
            }
            size={25}
            func={handleRepeat}
            title={
              repeat === "one"
                ? "Repeat One"
                : repeat === "all"
                ? "Repeat All"
                : "None Repeat"
            }
            color={`rgba(52,81,76,0.9)`}
            id="repeat"
          />
        </Col>
        <Col />{" "}
      </Row>
    </div>
  );
}

export default MusicPlayer;
