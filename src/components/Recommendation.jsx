import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

const Recommendation = ({ mood }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (mood) {
      fetchRecommendation();
    }
  }, [mood]);

  useEffect(() => {
    if (audioRef.current && currentSrc) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentSrc]);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await api.get(`/api/recommend/${mood}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendation");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Recommendations for {mood}</h3>

      {/* Activities */}
      <div className="card">
        <h4>🧘 Activities</h4>
        <ul>
          {data.activityRecommendation?.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      {/* Songs */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h4>🎵 Songs</h4>
        <ul>
          {data.musicRecommendation?.map((song, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <button
                onClick={() => setCurrentSrc(song.url)}
                style={{ marginRight: "8px" }}
              >
                ▶
              </button>
              {song.title}
            </li>
          ))}
        </ul>

        <audio ref={audioRef} controls style={{ width: "100%" }}>
          {currentSrc && <source src={currentSrc} type="audio/mpeg" />}
        </audio>
      </div>

      {/* Quote */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h4>💬 Quote</h4>
        <blockquote>
          "{data.quote}"
        </blockquote>
      </div>
    </div>
  );
};

export default Recommendation;
