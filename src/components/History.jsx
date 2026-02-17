import React, { useState, useEffect } from 'react';
import api from '../services/api';

const History = ({ username }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    const fetchHistory = async () => {
        setLoading(true);
        setError('');
        try {
            // GET /api/history/{username}
            const response = await api.get(`/history/${username}`);
            setHistory(response.data);
        } catch (err) {
            setError('Failed to fetch history: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this mood?')) return;

        try {
            // DELETE /api/mood/{id}
            await api.delete(`/mood/${id}`);
            setHistory(history.filter(item => item.id !== id));
        } catch (err) {
            alert('Failed to delete mood: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div>
            <h3>Mood History</h3>
            {loading && <p>Loading history...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {history.length === 0 && !loading ? (
                <p>No mood history found.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {history.map((record) => (
                        <li key={record.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{record.mood}</strong>
                                <br />
                                <small>{new Date(record.date).toLocaleString()}</small>
                            </div>
                            <button onClick={() => handleDelete(record.id)} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
