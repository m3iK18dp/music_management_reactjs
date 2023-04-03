import React, { useState, useRef, useEffect } from "react";
import { Button, ButtonGroup, ProgressBar } from "react-bootstrap";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRedo,
  FaRandom,
} from "react-icons/fa";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import {
  IoPlaySkipForwardOutline,
  IoPlaySkipBackOutline,
  IoPlayForwardOutline,
  IoPlayBackOutline,
} from "react-icons/io";
import {
  TbRepeatOnce,
  TbRepeat,
  TbRepeatOff,
  TbArrowsShuffle2,
} from "react-icons/tb";
import "../css/songs.css";
import { Row, Col } from "react-bootstrap";

import CustomButton from "../components/CustomButton";
import "../css/audioPlayer.css";
function MusicPlayer({
  songs,
  setIsPlaying,
  isPlaying,
  setCurrentSongPlaying,
  currentSongPlaying,
  audioRef,
}) {
  console.log(songs);
  const [change, setChange] = useState(0);
  //   const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTime, setCurrentTime] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [volume, setVolume] = useState(1);
  //   const [playbackRate, setPlaybackRate] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeat, setRepeat] = useState("none");
  /////
  let historyPlay = [currentSongPlaying];
  if (sessionStorage.getItem("historyPlay")) {
    historyPlay = sessionStorage.getItem("historyPlay");
    console.log(historyPlay);
    historyPlay = Array.from(historyPlay).push(currentSongPlaying);
  }
  sessionStorage.setItem("historyPlay", historyPlay);
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
  //   const handleTimeUpdate = () => {
  //     setCurrentTime(audioRef.current.currentTime);
  //   };
  //   const handleDurationChange = () => {
  //     setDuration(audioRef.current.duration);
  //   };
  const handleNextSong = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongPlaying(songs[randomIndex].id);
    } else {
      const newIndex =
        (songs.findIndex((song) => song.id === currentSongPlaying) +
          songs.length +
          1) %
        songs.length;
      setCurrentSongPlaying(songs[newIndex].id);
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
    }
  };
  //   const handleStart = () => {
  //     setCurrentTime(0);
  //     audioRef.current.currentTime = 0;
  //   };

  /////////not complete///////////////////////////////////////////
  const handleEnd = () => {
    // setCurrentTime(0);
    // audioRef.current.src=
    // audioRef.current.currentTime = 0;
    if (
      repeat === "none" &&
      getCurrentSongPlayingIndex() === songs.length - 1
    ) {
      setIsPlaying(false);
    } else if (repeat === "one") {
      // setCurrentSongPlaying(currentSongPlaying);
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsPlaying(true);
    } else handleNextSong();
  };
  //   const handlePlaybackRateChange = (event) => {
  //     const rate = parseFloat(event.target.value);
  //     setPlaybackRate(rate);
  //     audioRef.current.playbackRate = rate;
  //   };
  //   const handleVolumeChange = (event) => {
  //     const volume = parseFloat(event.target.value);
  //     setVolume(volume);
  //     audioRef.current.volume = volume;
  //   };
  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };
  //   return (
  //     <div>
  //       <audio
  //         src={currentSong.url}
  //         ref={audioRef}
  //         onTimeUpdate={handleTimeUpdate}
  //         onDurationChange={handleDurationChange}
  //         onEnded={handleEnd}
  //         playbackRate={playbackRate}
  //         volume={volume}
  //       />
  //       <h3>{currentSong.title}</h3>
  //       <p>{currentSong.musician}</p>
  //       <ProgressBar now={(currentTime / duration) * 100} />
  //       <ButtonGroup>
  //         <Button onClick={handlePrevSong}>
  //           <FaStepBackward />
  //         </Button>
  //         {isPlaying ? (
  //           <Button onClick={handlePause}>
  //             <FaPause />
  //           </Button>
  //         ) : (
  //           <Button onClick={handlePlay}>
  //             <FaPlay />
  //           </Button>
  //         )}
  //         <Button onClick={handleNextSong}>
  //           <FaStepForward />
  //         </Button>
  //         <Button onClick={handleStart}>
  //           <FaRedo />
  //         </Button>
  //         <Button onClick={handleShuffle}>
  //           <FaRandom />
  //         </Button>
  //       </ButtonGroup>
  //       <ButtonGroup>
  //         <Button onClick={() => (audioRef.current.currentTime -= 10)}>
  //           10s Backward
  //         </Button>
  //         <Button onClick={() => (audioRef.current.currentTime += 10)}>
  //           10s Forward
  //         </Button>
  //       </ButtonGroup>
  //       <div>
  //         <input
  //           type="range"
  //           min="0"
  //           max="1"
  //           step="0.01"
  //           value={volume}
  //           onChange={handleVolumeChange}
  //         />
  //       </div>
  //       <div>
  //         <input
  //           type="range"
  //           min="0.5"
  //           max="2"
  //           step="0.1"
  //           value={playbackRate}
  //           onChange={handlePlaybackRateChange}
  //         />
  //         <span>{playbackRate.toFixed(1)}x</span>
  //       </div>
  //       <div>
  //         <input
  //           type="range"
  //           min="0"
  //           max={duration}
  //           value={currentTime}
  //           onChange={(event) => {
  //             setCurrentTime(parseFloat(event.target.value));
  //             audioRef.current.currentTime = parseFloat(event.target.value);
  //           }}
  //         />
  //         <span>
  //           {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0)}
  //         </span>
  //       </div>
  //       <div>
  //         <ButtonGroup>
  //           <Button onClick={() => (audioRef.current.currentTime -= 5)}>
  //             5s Backward
  //           </Button>
  //           {isPlaying ? (
  //             <Button onClick={handlePause}>
  //               <FaPause />
  //             </Button>
  //           ) : (
  //             <Button onClick={handlePlay}>
  //               <FaPlay />
  //             </Button>
  //           )}
  //           <Button onClick={() => (audioRef.current.currentTime += 5)}>
  //             5s Forward
  //           </Button>
  //         </ButtonGroup>
  //         <div>
  //           <ButtonGroup>
  //             <Button onClick={() => (audioRef.current.currentTime -= 30)}>
  //               30s Backward
  //             </Button>
  //             {isPlaying ? (
  //               <Button onClick={handlePause}>
  //                 <FaPause />
  //               </Button>
  //             ) : (
  //               <Button onClick={handlePlay}>
  //                 <FaPlay />
  //               </Button>
  //             )}
  //             <Button onClick={() => (audioRef.current.currentTime += 30)}>
  //               30s Forward
  //             </Button>
  //           </ButtonGroup>
  //         </div>
  //         <div>
  //           <ButtonGroup>
  //             <Button onClick={() => setIsPlaying(true)}>Play</Button>
  //             <Button onClick={() => setIsPlaying(false)}>Pause</Button>
  //             <Button onClick={() => setIsPlaying(false)}>Stop</Button>
  //           </ButtonGroup>
  //         </div>
  //       </div>
  //     </div>
  //   );
  return (
    <>
      {console.log(songs[getCurrentSongPlayingIndex()])}
      <audio
        src={
          songs[getCurrentSongPlayingIndex()]
            ? songs[getCurrentSongPlayingIndex()].url
            : ""
        }
        controls={["volume", "seekbar", "duration"]}
        autoPlay={isPlaying}
        ref={audioRef}
        onEnded={handleEnd}
      />
      <Row className="controls-audio">
        <Col />
        <Col className="control">
          <CustomButton
            IconButton={TbArrowsShuffle2}
            size={25}
            func={handleShuffle}
            title={isShuffle ? "Shuffle Enabled" : "Shuffle Disabled"}
            color={isShuffle ? "rgba(52,81,76,0.8)" : "rgba(52,81,76,0.4)"}
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={FaStepBackward}
            size={25}
            func={handlePrevSong}
            title={"Prev Song"}
            color={"rgba(52,81,76,0.8)"}
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={!isPlaying ? CiPlay1 : CiPause1}
            size={30}
            func={!isPlaying ? handlePlay : handlePause}
            title={!isPlaying ? "Play" : "Pause"}
            color={"rgba(52,81,76,0.8)"}
          />
        </Col>
        <Col className="control">
          <CustomButton
            IconButton={FaStepForward}
            size={25}
            func={handleNextSong}
            title={"Next Song"}
            color={"rgba(52,81,76,0.8)"}
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
            color={`rgba(52,81,76,0.8)`}
          />
        </Col>
        <Col />{" "}
      </Row>
    </>
  );
}

export default MusicPlayer;
