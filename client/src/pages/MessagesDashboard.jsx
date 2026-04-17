import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageCard from '../components/MessageCard';

const MessagesDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [filter, setFilter] = useState('all'); // 'all' | 'present' | 'new'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchMessages(selectedProject);
        } else {
            setMessages([]);
        }
    }, [selectedProject]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data);
            if (res.data.length > 0) {
                setSelectedProject(res.data[0]._id);
            }
        } catch (err) {
            setError('Failed to load projects');
            console.error(err);
        }
    };

    const fetchMessages = async (projectId) => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`http://localhost:5000/api/messages?projectId=${projectId}`);
            setMessages(res.data);
        } catch (err) {
            setError('Failed to load messages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isPresent = (msg) => {
        const result = (msg.result || "").toLowerCase();
        return result.includes('already') || result.includes('matched');
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'all') return true;
        if (filter === 'present') return isPresent(msg);
        if (filter === 'new') return !isPresent(msg);
        return true;
    });

    const presentCount = messages.filter(isPresent).length;
    const newCount = messages.filter(m => !isPresent(m)).length;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>AI Agent Messages</h1>
                <div className="project-selector">
                    <label>Select Project:</label>
                    <select 
                        value={selectedProject} 
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="glass-select"
                    >
                        {projects.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </header>

            {selectedProject && (
                <div className="filter-tabs">
                    <button 
                        className={`tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({messages.length})
                    </button>
                    <button 
                        className={`tab ${filter === 'present' ? 'active' : ''}`}
                        onClick={() => setFilter('present')}
                    >
                        In Project ({presentCount})
                    </button>
                    <button 
                        className={`tab ${filter === 'new' ? 'active' : ''}`}
                        onClick={() => setFilter('new')}
                    >
                        New Research ({newCount})
                    </button>
                </div>
            )}

            <main className="messages-list">
                {loading && <div className="loader-container"><div className="loader"></div></div>}
                
                {error && <div className="error-msg">{error}</div>}
                
                {!loading && filteredMessages.length === 0 && selectedProject && (
                    <div className="empty-state">No messages match this filter.</div>
                )}

                {!loading && filteredMessages.map(msg => (
                    <MessageCard key={msg._id} message={msg} />
                ))}
            </main>

            <style jsx="true">{`
                .dashboard-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    color: #f8fafc;
                    animation: fadeIn 0.5s ease-out;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                }
                .dashboard-header h1 {
                    font-size: 2rem;
                    margin: 0;
                    background: linear-gradient(to right, #38bdf8, #818cf8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .project-selector {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .glass-select {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #f8fafc;
                    padding: 8px 16px;
                    border-radius: 8px;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .glass-select:focus {
                    border-color: #38bdf8;
                }
                .filter-tabs {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 30px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    padding-bottom: 15px;
                }
                .tab {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-weight: 500;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                .tab:hover {
                    color: #f8fafc;
                    background: rgba(255, 255, 255, 0.03);
                }
                .tab.active {
                    color: #38bdf8;
                    background: rgba(56, 189, 248, 0.1);
                    box-shadow: 0 0 15px rgba(56, 189, 248, 0.1);
                }
                .messages-list {
                    display: flex;
                    flex-direction: column;
                }
                .loader-container {
                    display: flex;
                    justify-content: center;
                    padding: 50px;
                }
                .loader {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(56, 189, 248, 0.1);
                    border-top: 4px solid #38bdf8;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                .error-msg {
                    color: #ef4444;
                    text-align: center;
                    padding: 20px;
                    background: rgba(239, 68, 68, 0.1);
                    border-radius: 8px;
                }
                .empty-state {
                    text-align: center;
                    color: #94a3b8;
                    padding: 60px;
                    font-style: italic;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default MessagesDashboard;
