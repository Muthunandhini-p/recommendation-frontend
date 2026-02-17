import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Recommendation = ({ mood }) => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mood) {
            fetchRecommendation();
        }
    }, [mood]);

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

    return (
        <div>
            <h3>Recommendations for {mood}</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {recommendation && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                    <p><strong>Music:</strong> {recommendation.musicRecommendation}</p>
                    <p><strong>Activity:</strong> {recommendation.activityRecommendation}</p>
                    <p><strong>Quote:</strong> "{recommendation.quote}"</p>
                </div>
            )}
        </div>
    );
};

export default Recommendation;
