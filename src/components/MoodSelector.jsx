import React, { useState } from "react";
import api from "../services/api";

const songMap = {
  HAPPY: [
    { name: "Happy Vibes", url: "/songs/happy1.mp3" },
    { name: "Feel Good", url: "/songs/happy2.mp3" },
  ],
  SAD: [
    { name: "Calm Piano", url: "/songs/sad1.mp3" },
    { name: "Soft Rain", url: "/songs/sad2.mp3" },
  ],
};

const MoodSelector = ({ user }) => {
  const [mood, setMood] = useState("");
  const [data, setData] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);

  const submitMood = async () => {
    await api.post("/mood", { username: user, mood });
    const res = await api.get(`/recommend/${mood}`);
    setData(res.data);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="section-title">Select Your Mood</h2>

        <select onChange={(e) => setMood(e.target.value)}>
          <option value="">Choose mood</option>
          <option value="HAPPY">Happy</option>
          <option value="SAD">Sad</option>
        </select>

        <button onClick={submitMood}>Get Recommendation</button>
      </div>

      {data && (
        <>
          {/* ACTIVITY */}
          <div className="card">
            <h3 className="section-title">🧘 Activity</h3>
            <p>{data.ACTIVITY?.content}</p>
          </div>

          {/* SONGS */}
          <div className="card">
            <h3 className="section-title">🎵 Songs</h3>

            {songMap[mood]?.map((song, i) => (
              <div
                key={i}
                className="song"
                onClick={() => setCurrentSong(song)}
              >
                ▶ {song.name}
              </div>
            ))}

            {currentSong && (
              <audio controls autoPlay style={{ width: "100%", marginTop: "10px" }}>
                <source src={currentSong.url} type="audio/mpeg" />
              </audio>
            )}
          </div>

          {/* QUOTE */}
          <div className="card">
            <h3 className="section-title">💬 Quote</h3>
            <em>"{data.QUOTE?.content}"</em>
          </div>
        </>
      )}
    </div>
  );
};

export default MoodSelector;
