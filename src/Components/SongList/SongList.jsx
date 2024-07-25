import "./SongList.css";
import PropTypes from "prop-types";
import { useRef } from "react";
import musicLogo from "../../assets/musicLogo.png";
import menuOpen from "../../assets/menu_open.svg";
import menuClose from "../../assets/menu_close.svg";

const SongList = ({ songs, onSelect }) => {
  const songRef = useRef();

  const listOpen = () => {
    songRef.current.style.right = "0";
  };

  const listClose = () => {
    songRef.current.style.right = "-350px";
  };

  return (
    <div className="song-list">
      <img src={musicLogo} alt="Music Logo" className="music-logo" />
      <div onClick={listOpen} className="menu-open" aria-label="Open menu">
        <img src={menuOpen} alt="Open Menu" />
      </div>
      <div className="container" ref={songRef} style={{ right: "-350px" }}>
        <div onClick={listClose} className="menu-close" aria-label="Close menu">
          <img src={menuClose} alt="Close Menu" />
        </div>
        <h2>Song List</h2>
        <ul className="list">
          {songs.map((song) => (
            <li
              key={song.id}
              onClick={() => onSelect(song)}
              className="song-item"
            >
              <img src={song.cover} alt={`${song.title} cover`} width="50" />
              <div className="song-info">
                <h4>{song.title}</h4>
                <h5>{song.artist}</h5>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

SongList.propTypes = {
  songs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      cover: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

SongList.defaultProps = {
  songs: [],
};

export default SongList;
