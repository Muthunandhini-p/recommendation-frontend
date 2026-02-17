import React, { useState } from "react";
import api from "../services/api";
import Recommendation from "./Recommendation";
import "../styles/MoodSelector.css";
import "../styles/Global.css";

const MoodSelector = ({ user }) => {
  const [mood, setMood] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  const submitMood = async () => {
    if (!mood) return;

    await api.post("/api/mood", {
      username: user,
      mood,
    });

    setSelectedMood(mood);
  };

  return (
    <div className="center-container">
      <div className="card-dark">
        <h2 className="mood-header">Select Your Mood</h2>

        <select
          className="mood-select"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">Choose mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
        </select>

        <button className="primary-btn" onClick={submitMood}>
          Get Recommendation
        </button>
      </div>

      {selectedMood && <Recommendation mood={selectedMood} />}
    </div>
  );
};

export default MoodSelector;
