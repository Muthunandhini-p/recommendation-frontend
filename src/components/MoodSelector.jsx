import React, { useState } from "react";
import api from "../services/api";
import Recommendation from "./Recommendation";

const MoodSelector = ({ user }) => {
  const [mood, setMood] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  const submitMood = async () => {
    if (!mood) return;

    try {
      // Save mood in backend
      await api.post("/api/mood", {
        username: user,
        mood: mood.toLowerCase()
      });

      // Trigger recommendation component
      setSelectedMood(mood.toLowerCase());
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Select Your Mood</h2>

        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Choose mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
        </select>

        <button onClick={submitMood}>
          Get Recommendation
        </button>
      </div>

      {selectedMood && <Recommendation mood={selectedMood} />}
    </div>
  );
};

export default MoodSelector;
