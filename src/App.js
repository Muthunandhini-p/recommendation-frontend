import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import MoodSelector from './components/MoodSelector';
import Recommendation from './components/Recommendation';
import History from './components/History';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentMood(null);
    setActiveTab('new');
  };

  const handleMoodSelected = (mood) => {
    setCurrentMood(mood);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mood Recommender</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>

      <main className="App-main">
        {!user ? (
          <div className="auth-container">
            {showRegister ? (
              <Register onSwitch={() => setShowRegister(false)} />
            ) : (
              <Login onLogin={handleLogin} onSwitch={() => setShowRegister(true)} />
            )}
          </div>
        ) : (
          <div className="dashboard">
            <div className="tabs">
              <button
                className={activeTab === 'new' ? 'active' : ''}
                onClick={() => setActiveTab('new')}
              >
                New Mood
              </button>
              <button
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'new' ? (
                <>
                  <MoodSelector username={user} onMoodSelected={handleMoodSelected} />
                  <Recommendation mood={currentMood} />
                </>
              ) : (
                <History username={user} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default App;
