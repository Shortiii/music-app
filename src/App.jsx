import "./App.css";
import { useState } from "react";
import MusicPlayer from "./Components/MusicPlayer/MusicPlayer";
import { songs } from "./data/songs";
import SongList from "./Components/SongList/SongList";

const App = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  return (
    <div className="app">
      <SongList
        songs={songs}
        onSelect={(song) => setCurrentSongIndex(songs.indexOf(song))}
      />
      <MusicPlayer
        songs={songs}
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
      />
    </div>
  );
};

export default App;
