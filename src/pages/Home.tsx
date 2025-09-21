import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInterface from '../components/search/SearchInterface';
import { useApp } from '../contexts/AppContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { createConversation } = useApp();

  const handleQuickAction = (query: string) => {
    const conversationId = createConversation();
    navigate(`/chat/${conversationId}`, { state: { initialQuery: query } });
  };

  const handleSearch = (query: string) => {
    const conversationId = createConversation();
    navigate(`/chat/${conversationId}`, { state: { initialQuery: query } });
  };

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-icon">N</div>
            <h1 className="main-title">nexus</h1>
          </div>
          <p className="subtitle">Your unified enterprise knowledge portal</p>
        </div>

        <SearchInterface onSearch={handleSearch} />

        <div className="quick-actions">
          <h3>Try searching for:</h3>
          <div className="quick-actions-grid">
            {[
              { icon: '👥', label: 'Employee', query: 'employee handbook' },
              { icon: '🔒', label: 'Security', query: 'security policies' },
              { icon: '📊', label: 'Projects', query: 'project documentation' },
              { icon: '📋', label: 'Policies', query: 'company policies' }
            ].map((action, index) => (
              <button
                key={index}
                className="quick-action-button"
                onClick={() => handleQuickAction(action.query)}
              >
                <span className="quick-action-icon">{action.icon}</span>
                <span className="quick-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;