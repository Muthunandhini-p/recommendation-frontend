import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const defaultActivities = [
    'Take a short walk outside',
    'Try a 5-minute breathing exercise',
    "Write down three things you're grateful for",
    'Listen to your favorite song and dance'
];

const defaultSongs = [
    {
        title: 'Happy Vibes (Sample)',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
        title: 'Feel Good (Sample)',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    }
];

const defaultQuote = "Happiness is a direction, not a place.";

const Recommendation = ({ mood }) => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentSrc, setCurrentSrc] = useState('');
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
        setError('');
        setRecommendation(null);
        try {
            const response = await api.get(`/recommend/${mood}`);
            setRecommendation(response.data);
        } catch (err) {
            setError('Failed to fetch recommendation: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (!mood) return null;

    // Normalize data with sensible defaults
    const activities = recommendation?.activityRecommendation
        ? Array.isArray(recommendation.activityRecommendation)
            ? recommendation.activityRecommendation
            : [recommendation.activityRecommendation]
        : defaultActivities;

    const songs = recommendation?.musicRecommendation
        ? Array.isArray(recommendation.musicRecommendation)
            ? recommendation.musicRecommendation
            : [{ title: recommendation.musicRecommendation, url: '' }]
        : defaultSongs;

    const quote = recommendation?.quote || defaultQuote;

    return (
        <div>
            <h3>Recommendations for {mood}</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginTop: '16px', padding: '18px', borderRadius: '8px', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                <h4>🔔 Activity</h4>
                <ul>
                    {activities.map((a, idx) => (
                        <li key={idx}>{a}</li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: '18px', padding: '18px', borderRadius: '8px', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                <h4>🎵 Songs</h4>
                <ul>
                    {songs.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>
                            <button onClick={() => setCurrentSrc(s.url)} style={{ marginRight: '8px' }}>
                                ▶
                            </button>
                            {s.title}
                        </li>
                    ))}
                </ul>
                <div style={{ marginTop: '12px' }}>
                    <audio ref={audioRef} controls style={{ width: '100%' }}>
                        {currentSrc ? <source src={currentSrc} /> : <source src={songs[0].url} />}
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>

            <div style={{ marginTop: '18px', padding: '18px', borderRadius: '8px', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                <h4>💬 Quote</h4>
                <blockquote style={{ margin: 0, fontStyle: 'italic' }}>
                    "{quote}"
                </blockquote>
            </div>
        </div>
    );
};

export default Recommendation;
