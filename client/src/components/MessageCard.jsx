import React from 'react';

const MessageCard = ({ message }) => {
    // Helper to format text into bullet points
    const formatToBullets = (text) => {
        if (!text) return null;
        // Split by common delimiters like periods, newlines, or semicolons
        const points = text.split(/[.\n;]+/).filter(p => p.trim().length > 10);
        
        if (points.length <= 1) return <p className="bullet-text"> {text}</p>;
        
        return (
            <ul className="bullet-list">
                {points.map((point, index) => (
                    <li key={index}>• {point.trim()}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="message-container">
            {/* Container 1: Existing Project Context (if present) */}
            {message.matchedContext && (
                <div className="analysis-card matched-context animate-slide-in">
                    <div className="analysis-header">
                        <span className="analysis-icon">📂</span>
                        <h4>Project Environment (Already Present)</h4>
                        <span className="status-indicator">Context Match</span>
                    </div>
                    <div className="analysis-body">
                        {formatToBullets(message.matchedContext)}
                    </div>
                </div>
            )}

            {/* Container 2: New Research Analysis */}
            <div className={`analysis-card ${message.matchedContext ? 'new-insight' : 'full-analysis'} animate-slide-in-delayed`}>
                <div className="analysis-header">
                    <span className="analysis-icon">🆕</span>
                    <h4>{message.matchedContext ? 'Incremental Research Insight' : 'Full Research Analysis'}</h4>
                    <span className="timestamp">{new Date(message.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="analysis-body">
                    {message.result && (
                        <div className={`badge ${message.result.includes('Already') ? 'error' : 'success'}`}>
                            {message.result}
                        </div>
                    )}
                    {formatToBullets(message.text)}
                </div>

                {message.sourceUrl && (
                    <div className="source-row">
                        <a href={message.sourceUrl} target="_blank" rel="noreferrer" className="pill-link">
                            🔗 {message.pageTitle || 'Source Source'}
                        </a>
                    </div>
                )}
            </div>

            <style jsx="true">{`
                .message-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 30px;
                    perspective: 1000px;
                }

                .analysis-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .analysis-card:hover {
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    border-color: rgba(56, 189, 248, 0.3);
                    background: rgba(255, 255, 255, 0.05);
                }

                .matched-context {
                    border-left: 4px solid #ef4444;
                    background: rgba(239, 68, 68, 0.02);
                }

                .new-insight {
                    border-left: 4px solid #10b981;
                    background: rgba(16, 185, 129, 0.02);
                }

                .analysis-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                }

                .analysis-header h4 {
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #e2e8f0;
                    flex: 1;
                }

                .status-indicator {
                    font-size: 0.7rem;
                    color: #ef4444;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                }

                .analysis-body {
                    padding-left: 32px;
                }

                .bullet-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .bullet-list li {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #cbd5e1;
                    margin-bottom: 10px;
                    padding-left: 10px;
                    border-left: 1px solid rgba(255,255,255,0.05);
                }

                .bullet-text {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #cbd5e1;
                    margin: 0;
                }

                .badge {
                    display: inline-block;
                    font-size: 0.7rem;
                    padding: 3px 10px;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    font-weight: 600;
                }

                .badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
                .badge.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

                .source-row {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .pill-link {
                    font-size: 0.8rem;
                    color: #38bdf8;
                    text-decoration: none;
                    background: rgba(56, 189, 248, 0.08);
                    padding: 6px 14px;
                    border-radius: 100px;
                    border: 1px solid rgba(56, 189, 248, 0.2);
                    transition: all 0.2s;
                }

                .pill-link:hover {
                    background: rgba(56, 189, 248, 0.15);
                    box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
                }

                .timestamp { font-size: 0.75rem; color: #64748b; }

                /* Animations */
                .animate-slide-in {
                    animation: slideIn 0.5s ease-out forwards;
                }

                .animate-slide-in-delayed {
                    animation: slideIn 0.5s ease-out 0.2s forwards;
                    opacity: 0;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px) rotateX(-5deg); }
                    to { opacity: 1; transform: translateY(0) rotateX(0); }
                }
            `}</style>
        </div>
    );
};

export default MessageCard;
