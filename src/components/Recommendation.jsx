import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "../styles/Recommendation.css";
import "../styles/Global.css";

const Recommendation = ({ mood }) => {
  const [data, setData] = useState(null);
  const audioRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/api/recommend/${mood}`);
      setData(response.data);
    };

    fetchData();
  }, [mood]);

  if (!data) return null;

  return (
    <div className="recommendation-section">
      <div className="card-dark">
        <h3>🧘 Activities</h3>
        <ul>
          {data.activityRecommendation.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="card-dark">
        <h3>🎵 Songs</h3>
        <ul>
          {data.musicRecommendation.map((song, i) => (
            <li key={i}>
              <button
                className="song-btn"
                onClick={() => setCurrentSrc(song.url)}
              >
                ▶
              </button>
              {song.title}
            </li>
          ))}
        </ul>

        <audio ref={audioRef} controls>
          {currentSrc && <source src={currentSrc} />}
        </audio>
      </div>

      <div className="card-dark">
        <h3>💬 Quote</h3>
        <blockquote>{data.quote}</blockquote>
      </div>
    </div>
  );
};

export default Recommendation;
