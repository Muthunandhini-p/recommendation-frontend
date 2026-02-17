import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "../styles/App.css";

const Recommendation = ({ mood }) => {
  const [data, setData] = useState(null);
  const [currentSrc, setCurrentSrc] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (!mood) return;

    async function fetchRecommendation() {
      try {
        const res = await api.get(`/api/recommend/${mood}`);
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRecommendation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  useEffect(() => {
    if (audioRef.current && currentSrc) {
      audioRef.current.src = currentSrc;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentSrc]);

  if (!data) return null;

  return (
    <div>
      <div className="card">
        <h3 className="section-title">🧘 Activities</h3>
        <ul>
          {data.activityRecommendation?.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="section-title">🎵 Songs</h3>
        {data.musicRecommendation?.map((song, index) => (
          <div key={index} className="song-item">
            <button
              className="primary-btn"
              onClick={() => setCurrentSrc(song.url)}
            >
              ▶
            </button>
            {song.title}
          </div>
        ))}
        <audio ref={audioRef} controls />
      </div>

      <div className="card">
        <h3 className="section-title">💬 Quote</h3>
        <blockquote>"{data.quote}"</blockquote>
      </div>
    </div>
  );
};

export default Recommendation;
