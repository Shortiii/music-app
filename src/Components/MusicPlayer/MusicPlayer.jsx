import "./MusicPlayer.css";
import PropTypes from "prop-types";
import backwardLogo from "../../assets/backward-logo.png";
import forwardLogo from "../../assets/forward-logo.png";
import playLogo from "../../assets/play-icon.png";
import pauseLogo from "../../assets/pause-icon.png";
import muteLogo from "../../assets/mute-icon.png";
import unmuteLogo from "../../assets/unmute-icon.png";
import shuffleLogo from "../../assets/shuffle-logo.png";
import { useEffect, useRef, useState } from "react";

const MusicPlayer = ({ songs, currentSongIndex, setCurrentSongIndex }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState([]);

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    );
  };

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value / 5;
    audioRef.current.volume = volume;
    setIsMuted(volume === 0);
  };

  const handleMuteUnmute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleTimeChange = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
      setShuffledSongs(shuffleArray([...songs]));
    } else {
      setShuffledSongs([]);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.volume = 1; // Set default volume to highest
      setCurrentTime(0); // Reset current time when the song changes
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play was prevented:", error);
        });
      }
    }
  }, [currentSongIndex]);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const handleEnded = () => {
      handleNext();
    };

    const audioElement = audioRef.current;
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  });

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const currentSong = isShuffled
    ? shuffledSongs[currentSongIndex]
    : songs[currentSongIndex];

  return (
    <div className="music-playlist">
      <h2>Now Playing</h2>
      <div className="playlist">
        {currentSong ? (
          <div className="section">
            <div className="main-section">
              <img
                src={currentSong.cover}
                alt={`${currentSong.title} cover`}
                width="100"
              />
              <h1>{currentSong.title}</h1>
              <p>{currentSong.artist}</p>
            </div>
          </div>
        ) : (
          <p>Select a song to play</p>
        )}
        <div className="control">
          <audio ref={audioRef} controls src={currentSong.url} />
          <div className="control-icon">
            <div onClick={handlePrev}>
              <img src={backwardLogo} alt="Previous" />
            </div>
            <div onClick={handlePlayPause} className="play-icon">
              {audioRef.current?.paused ? (
                <img src={playLogo} alt="Play" />
              ) : (
                <img src={pauseLogo} alt="Pause" />
              )}
            </div>
            <div onClick={handleNext}>
              <img src={forwardLogo} alt="Next" />
            </div>
            <div onClick={handleShuffle} className="shuffle-icon">
              <img src={shuffleLogo} alt="Shuffle" />
            </div>
          </div>

          <div className="volume-control">
            <div onClick={handleMuteUnmute} className="volume-icon">
              <img
                src={isMuted ? unmuteLogo : muteLogo}
                alt={isMuted ? "Unmute" : "Mute"}
              />
            </div>
            <input
              type="range"
              id="volume"
              name="volume"
              min="1"
              max="5"
              step="1"
              defaultValue="5"
              onChange={handleVolumeChange}
            />
          </div>
          <div className="time-control">
            <p>{formatTime(currentTime)}</p>
            <input
              type="range"
              id="time"
              name="time"
              min="0"
              max="100"
              step="0.005"
              value={(currentTime / audioRef.current?.duration) * 100 || 0}
              onChange={handleTimeChange}
              style={{
                backgroundSize: `${(currentTime / duration) * 100}% 100%`,
              }}
            />
            <p>{formatTime(duration)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

MusicPlayer.propTypes = {
  songs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      cover: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentSongIndex: PropTypes.number.isRequired,
  setCurrentSongIndex: PropTypes.func.isRequired,
};

export default MusicPlayer;
