import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useApp } from '../contexts/AppContext';
import { fetchWebsiteMetadata } from '../utils/websiteMetadata';

interface Tool {
  id: string;
  url: string;
  name: string;
  favicon?: string;
  isLoading?: boolean;
}

const Tools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const { favoriteTools, addFavoriteTool, removeFavoriteTool, isFavorite } = useApp();

  const getHostnameSafely = (urlString: string): string => {
    try {
      return new URL(urlString).hostname;
    } catch {
      return urlString.replace(/^\//, '').split('/')[0] || 'internal-tool';
    }
  };

  useEffect(() => {
    const predefinedTools: Tool[] = [
      {
        id: '1',
        url: 'https://company.sharepoint.com',
        name: 'SharePoint Portal'
      },
      {
        id: '2',
        url: '/wiki',
        name: 'Internal Wiki'
      },
      {
        id: '3',
        url: '/hr-portal',
        name: 'HR Self-Service Portal'
      },
      {
        id: '4',
        url: '/it-support',
        name: 'IT Support Desk'
      },
      {
        id: '5',
        url: '/projects',
        name: 'Project Management Hub'
      },
      {
        id: '6',
        url: '/analytics',
        name: 'Analytics Dashboard'
      }
    ];

    const externalUrls = [
      'https://sample.ipsos.com',
      'https://cortex5.ipsos.com/'
    ];

    const externalTools = externalUrls.map((url, index) => ({
      id: `external_${index + 1}`,
      url,
      name: 'Loading...',
      isLoading: true
    }));

    setTools([...predefinedTools, ...externalTools]);

    externalTools.forEach(async (tool) => {
      try {
        const metadata = await fetchWebsiteMetadata(tool.url);
        setTools(prev => prev.map(t => 
          t.id === tool.id ? {
            ...t,
            name: metadata.title || getHostnameSafely(tool.url),
            favicon: metadata.favicon,
            isLoading: false
          } : t
        ));
      } catch (error) {
        console.error(`Failed to fetch metadata for ${tool.url}:`, error);
        setTools(prev => prev.map(t => 
          t.id === tool.id ? {
            ...t,
            name: getHostnameSafely(tool.url),
            isLoading: false
          } : t
        ));
      }
    });
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (tool: Tool) => {
    if (isFavorite(tool.id)) {
      removeFavoriteTool(tool.id);
    } else {
      addFavoriteTool({
        id: tool.id,
        name: tool.name,
        url: tool.url
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>
            Enterprise Tools
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
            Discover and organize your company's digital tools and resources
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <MagnifyingGlassIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                background: 'transparent'
              }}
            />
          </div>
        </div>

        {favoriteTools.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <StarIconSolid style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
              Favorite Tools ({favoriteTools.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              {favoriteTools.map((favTool) => {
                const fullTool = tools.find(t => t.id === favTool.id);
                if (!fullTool) return null;
                return (
                  <ToolCard
                    key={`fav-${fullTool.id}`}
                    tool={fullTool}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            All Tools ({filteredTools.length})
          </h2>
          
          {filteredTools.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <p>No tools found matching your search</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isFavorite(tool.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorite, onToggleFavorite }) => {
  const handleToolClick = () => {
    if (!tool.isLoading) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fallback = img.nextElementSibling as HTMLElement;
    img.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      padding: '0.75rem',
      cursor: tool.isLoading ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      color: 'white',
      opacity: tool.isLoading ? 0.7 : 1,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      height: '60px'
    }}
    onMouseEnter={(e) => {
      if (!tool.isLoading) {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    onClick={handleToolClick}>
      
      <div style={{ 
        width: '24px', 
        height: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {tool.favicon && !tool.isLoading ? (
          <img 
            src={tool.favicon} 
            alt="favicon" 
            style={{ width: '24px', height: '24px', display: 'block' }}
            onError={handleImageError}
          />
        ) : (
          <span style={{ 
            display: 'block',
            fontSize: '1.2rem'
          }}>
            {tool.isLoading ? '⏳' : '🔗'}
          </span>
        )}
      </div>
      
      <h3 style={{ 
        fontWeight: '500', 
        fontSize: '0.9rem',
        margin: 0,
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {tool.name}
      </h3>

      {!tool.isLoading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tool);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '4px',
            flexShrink: 0
          }}
        >
          {isFavorite ? (
            <StarIconSolid style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
          ) : (
            <StarIcon style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.6)' }} />
          )}
        </button>
      )}
    </div>
  );
};

export default Tools;