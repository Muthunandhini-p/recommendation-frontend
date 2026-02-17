import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/History.css";
import "../styles/Global.css";

const History = ({ username }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (username) {
      api.get(`/api/history/${username}`).then((res) => {
        setHistory(res.data);
      });
    }
  }, [username]);

  return (
    <div className="center-container">
      <div className="card-dark">
        <h2>Mood History</h2>

        <ul className="history-list">
          {history.map((record) => (
            <li key={record.id} className="history-item">
              <div>
                <strong>{record.mood}</strong>
                <br />
                <small>
                  {new Date(record.timestamp).toLocaleString()}
                </small>
              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  api.delete(`/api/mood/${record.id}`).then(() =>
                    setHistory(history.filter((h) => h.id !== record.id))
                  )
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;
