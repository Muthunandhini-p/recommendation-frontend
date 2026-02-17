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

    // Normalize data with sensible defaults and guard against empty arrays/strings
    const normalizeActivities = (raw) => {
        if (!raw) return defaultActivities;
        const arr = Array.isArray(raw) ? raw : [raw];
        const cleaned = arr.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean);
        return cleaned.length ? cleaned : defaultActivities;
    };

    const normalizeSongs = (raw) => {
        if (!raw) return defaultSongs;
        const arr = Array.isArray(raw) ? raw : [{ title: raw, url: '' }];
        const cleaned = arr
            .map((s) => {
                if (typeof s === 'string') return { title: s, url: '' };
                return { title: s.title || 'Unknown', url: s.url || '' };
            })
            .filter((s) => s.title || s.url);
        // If none have usable urls, still show titles but fall back to default urls
        if (!cleaned.length) return defaultSongs;
        const anyUrl = cleaned.some((s) => s.url && s.url.trim());
        if (!anyUrl) {
            return cleaned.map((s, i) => ({ title: s.title, url: defaultSongs[i % defaultSongs.length].url }));
        }
        return cleaned;
    };

    const normalizeQuote = (raw) => {
        if (!raw && raw !== '') return defaultQuote;
        let q = String(raw ?? '').trim();
        // remove surrounding quotes like "..." or '...'
        if ((q.startsWith('"') && q.endsWith('"')) || (q.startsWith("'") && q.endsWith("'"))) {
            q = q.slice(1, -1).trim();
        }
        return q || defaultQuote;
    };

    const activities = normalizeActivities(recommendation?.activityRecommendation);
    const songs = normalizeSongs(recommendation?.musicRecommendation);
    const quote = normalizeQuote(recommendation?.quote);

    return (
        <div>
            <h3>Recommendations for {mood}</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {recommendation && (
                <div style={{ marginTop: 12, padding: 8, background: '#f7f7fb', borderRadius: 6, fontSize: 12 }}>
                    <strong>Debug:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 6 }}>{JSON.stringify(recommendation, null, 2)}</pre>
                </div>
            )}

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
                            <button
                                onClick={() => setCurrentSrc(s.url || defaultSongs[0].url)}
                                style={{ marginRight: '8px' }}
                            >
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
