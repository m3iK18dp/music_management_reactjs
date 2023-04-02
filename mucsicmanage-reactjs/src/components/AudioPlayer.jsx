import React, { Component } from "react";
import {
  FaStepBackward,
  FaStepForward,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaRandom,
  FaRetweet,
  FaSync,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.state = {
      playlist: props.songs,
      currentTrackIndex: 0,
      isPlaying: false,
      isLoopAll: false,
      isLoopOne: false,
      isShuffle: false,
      volume: 1,
      playbackRate: 1,
      currentTime: 0,
      duration: 0,
      isMuted: false,
      isDraggingTime: false,
      timerId: null,
    };
  }

  componentDidMount() {
    this.audioRef.current.addEventListener("canplay", this.handleCanPlay);
    this.audioRef.current.addEventListener("play", this.handlePlay);
    this.audioRef.current.addEventListener("pause", this.handlePause);
    this.audioRef.current.addEventListener("ended", this.handleEnded);
    this.audioRef.current.addEventListener("timeupdate", this.handleTimeUpdate);
    this.audioRef.current.addEventListener(
      "durationchange",
      this.handleDurationChange
    );
  }

  componentWillUnmount() {
    this.audioRef.current.removeEventListener("canplay", this.handleCanPlay);
    this.audioRef.current.removeEventListener("play", this.handlePlay);
    this.audioRef.current.removeEventListener("pause", this.handlePause);
    this.audioRef.current.removeEventListener("ended", this.handleEnded);
    this.audioRef.current.removeEventListener(
      "timeupdate",
      this.handleTimeUpdate
    );
    this.audioRef.current.removeEventListener(
      "durationchange",
      this.handleDurationChange
    );
  }

  handleCanPlay = () => {
    this.setState({ duration: this.audioRef.current.duration });
  };

  handlePlay = () => {
    this.setState({ isPlaying: true });
    this.startTimer();
  };

  handlePause = () => {
    this.setState({ isPlaying: false });
    this.stopTimer();
  };

  handleEnded = () => {
    if (this.state.isLoopOne) {
      this.audioRef.current.currentTime = 0;
      this.audioRef.current.play();
    } else {
      this.playNextTrack();
    }
  };

  handleTimeUpdate = () => {
    if (!this.state.isDraggingTime) {
      this.setState({ currentTime: this.audioRef.current.currentTime });
    }
  };

  handleDurationChange = () => {
    this.setState({ duration: this.audioRef.current.duration });
  };

  startTimer = () => {
    this.setState({
      timerId: setInterval(() => {
        this.setState((prevState) => ({
          currentTime: prevState.currentTime + 1,
        }));
      }, 1000),
    });
  };

  stopTimer = () => {
    clearInterval(this.state.timerId);
    this.setState({ timerId: null });
  };

  playNextTrack = () => {
    const { playlist, currentTrackIndex, isLoopAll, isShuffle } = this.state;

    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      this.setState({ currentTrackIndex: nextIndex });
    } else if (isLoopAll) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      this.setState({ currentTrackIndex: nextIndex });
    } else if (currentTrackIndex < playlist.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      this.setState({ currentTrackIndex: nextIndex });
    } else {
      this.audioRef.current.pause();
      this.setState({ currentTrackIndex: 0 });
    }
  };
  playPrevTrack = () => {
    const { playlist, currentTrackIndex } = this.state;
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      this.setState({ currentTrackIndex: prevIndex });
    } else {
      this.audioRef.current.pause();
      this.setState({ currentTrackIndex: playlist.length - 1 });
    }
  };

  playFirstTrack = () => {
    this.audioRef.current.currentTime = 0;
    this.setState({ currentTrackIndex: 0 });
    this.audioRef.current.play();
  };

  playLastTrack = () => {
    const { playlist } = this.state;
    this.audioRef.current.currentTime = 0;
    this.setState({ currentTrackIndex: playlist.length - 1 });
    this.audioRef.current.play();
  };

  handlePlayPauseClick = () => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      this.audioRef.current.pause();
    } else {
      this.audioRef.current.play();
    }
  };

  handleVolumeChange = (e) => {
    const { value } = e.target;
    this.audioRef.current.volume = value;
    this.setState({ volume: value });
  };

  handlePlaybackRateChange = (e) => {
    const { value } = e.target;
    this.audioRef.current.playbackRate = value;
    this.setState({ playbackRate: value });
  };

  handleTimeChange = (e) => {
    const { value } = e.target;
    this.audioRef.current.currentTime = value;
    this.setState({ currentTime: value });
  };

  handleTimeDragStart = () => {
    this.setState({ isDraggingTime: true });
  };

  handleTimeDragEnd = () => {
    this.setState({ isDraggingTime: false });
  };

  handleMuteClick = () => {
    const { isMuted, volume } = this.state;
    if (isMuted) {
      this.audioRef.current.volume = volume;
      this.setState({ isMuted: false });
    } else {
      this.audioRef.current.volume = 0;
      this.setState({ isMuted: true });
    }
  };

  handleShuffleClick = () => {
    this.setState((prevState) => ({ isShuffle: !prevState.isShuffle }));
  };

  handleLoopAllClick = () => {
    this.setState((prevState) => ({
      isLoopAll: !prevState.isLoopAll,
      isLoopOne: false,
    }));
  };

  handleLoopOneClick = () => {
    this.setState((prevState) => ({
      isLoopOne: !prevState.isLoopOne,
      isLoopAll: false,
    }));
  };

  formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  render() {
    const {
      playlist,
      currentTrackIndex,
      isPlaying,
      volume,
      playbackRate,
      currentTime,
      duration,
      isMuted,
      isDraggingTime,
    } = this.state;
    const currentTrack = playlist[currentTrackIndex];

    return (
      <>
        <div className="audio-player">
          <div className="audio-player__info">
            <div className="audio-player__info__title">
              {currentTrack.title}
            </div>
            <div className="audio-player__info__artist">
              {currentTrack.musician}
            </div>
          </div>
          <div className="audio-player__controls">
            <button
              className="audio-player__button"
              onClick={this.playPrevTrack}
            >
              <FaStepBackward />
            </button>
            <button
              className="audio-player__button"
              onClick={this.handlePlayPauseClick}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              className="audio-player__button"
              onClick={this.playNextTrack}
            >
              <FaStepForward />
            </button>
            <button
              className="audio-player__button"
              onClick={this.handleMuteClick}
            >
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button
              className="audio-player__button"
              onClick={this.handleShuffleClick}
            >
              <FaRandom className={this.state.isShuffle ? "active" : ""} />
            </button>
            <button
              className="audio-player__button"
              onClick={this.handleLoopAllClick}
            >
              <FaRetweet className={this.state.isLoopAll ? "active" : ""} />
            </button>
            <button
              className="audio-player__button"
              onClick={this.handleLoopOneClick}
            >
              <FaSync className={this.state.isLoopOne ? "active" : ""} />
            </button>
            <button
              className="audio-player__button"
              onClick={this.playFirstTrack}
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              className="audio-player__button"
              onClick={this.playLastTrack}
            >
              <FaAngleDoubleRight />
            </button>
            <span className="audio-player__playback-rate">{playbackRate}x</span>
            <input
              type="range"
              className="audio-player__playback-rate-slider"
              min="0.5"
              max="2"
              step="0.1"
              value={playbackRate}
              onChange={this.handlePlaybackRateChange}
            />
            <div className="audio-player__time">
              <span className="audio-player__time__current">
                {this.formatTime(currentTime)}
              </span>
              <input
                type="range"
                className="audio-player__time__slider"
                min="0"
                max={duration || 0}
                step="1"
                value={isDraggingTime ? currentTime : duration || 0}
                onChange={this.handleTimeChange}
                onMouseDown={this.handleTimeDragStart}
                onMouseUp={this.handleTimeDragEnd}
              />
              <span className="audio-player__time__duration">
                {duration ? this.formatTime(duration) : "0:00"}
              </span>
            </div>
            <button
              className="audio-player__button"
              onClick={this.playFirstTrack}
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              className="audio-player__button"
              onClick={this.playLastTrack}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
          <audio
            src={currentTrack.url}
            ref={this.audioRef}
            onEnded={this.handleAudioEnded}
            onTimeUpdate={this.handleAudioTimeUpdate}
            onLoadedMetadata={this.handleAudioLoadedMetadata}
          />
        </div>
      </>
    );
  }
}

export default AudioPlayer;
