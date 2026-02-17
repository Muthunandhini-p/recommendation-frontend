import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "../styles/Global.css";

const Recommendation = ({ mood }) => {
  const [data, setData] = useState(null);
  const [currentSrc, setCurrentSrc] = useState("");
  const audioRef = useRef(null);

  // Fetch recommendation when mood changes
  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await api.get(`/api/recommend/${mood}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      }
    };

    if (mood) {
      fetchRecommendation();
    }
  }, [mood]);

  // Play audio when source changes
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
      {/* Activities */}
      <div className="card">
        <h3 className="section-title">🧘 Activities</h3>
        <ul>
          {data.activityRecommendation?.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      {/* Songs */}
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

      {/* Quote */}
      <div className="card">
        <h3 className="section-title">💬 Quote</h3>
        <blockquote>"{data.quote}"</blockquote>
      </div>
    </div>
  );
};

export default Recommendation;
