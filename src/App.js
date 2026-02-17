import React, { useState } from "react";
import "./styles/Global.css";

import Login from "./components/Login";
import Register from "./components/Register";
import MoodSelector from "./components/MoodSelector";
import Recommendation from "./components/Recommendation";
import History from "./components/History";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [activeTab, setActiveTab] = useState("new");

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentMood(null);
    setActiveTab("new");
  };

  const handleMoodSelected = (mood) => {
    setCurrentMood(mood);
  };

  return (
    <div className="app-container">
      
      {/* HEADER */}
      <div className="app-header">
        <div className="logo">Mood Recommender</div>

        {user && (
          <div className="user-section">
            <span className="welcome-text">
              Welcome, <strong>{user}</strong>
            </span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="app-content">
        {!user ? (
          <div className="auth-wrapper">
            {showRegister ? (
              <Register onSwitch={() => setShowRegister(false)} />
            ) : (
              <Login
                onLogin={handleLogin}
                onSwitch={() => setShowRegister(true)}
              />
            )}
          </div>
        ) : (
          <div className="dashboard-wrapper">
            
            {/* NAVIGATION */}
            <div className="nav-bar">
              <button
                className={`nav-btn ${
                  activeTab === "new" ? "active" : ""
                }`}
                onClick={() => setActiveTab("new")}
              >
                New Mood
              </button>

              <button
                className={`nav-btn ${
                  activeTab === "history" ? "active" : ""
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="dashboard-content">
              {activeTab === "new" ? (
                <>
                  <MoodSelector
                    user={user}
                    onMoodSelected={handleMoodSelected}
                  />
                  {currentMood && (
                    <Recommendation mood={currentMood} />
                  )}
                </>
              ) : (
                <History username={user} />
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
