import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, PlusIcon as PlusIconSolid } from '@heroicons/react/24/solid';
import { useApp } from '../contexts/AppContext';
import { fetchWebsiteMetadata } from '../utils/websiteMetadata';

interface Tool {
  id: string;
  url: string;
  name: string;
  categories: string[];
  favicon?: string;
  isLoading?: boolean;
  description?: string;
  icon?: string;
  tags?: string[];
}

const getHostnameSafely = (urlString: string): string => {
  try {
    return new URL(urlString).hostname;
  } catch {
    return urlString.replace(/^\//, '').split('/')[0] || 'internal-tool';
  }
};

const Tools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const { 
    favoriteTools, addFavoriteTool, removeFavoriteTool, isFavorite, 
    isToolInDashboard, addToolToDashboard, removeToolFromDashboard 
  } = useApp();
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  useEffect(() => {
    const initialTools: Tool[] = [
      // Internal tools, manually defined
      {
        id: '1',
        name: 'SharePoint Portal',
        description: 'Central document management and collaboration platform for all company files',
        url: 'https://company.sharepoint.com',
        categories: ['Resources'],
        icon: '📄',
        tags: ['documents', 'collaboration', 'files', 'sharepoint']
      },
      {
        id: '2',
        name: 'Internal Wiki',
        description: 'Company knowledge base and documentation repository',
        url: '/wiki',
        categories: ['Resources'],
        icon: '📖',
        tags: ['wiki', 'documentation', 'knowledge', 'procedures']
      },
      {
        id: '3',
        name: 'HR Self-Service Portal',
        description: 'Access HR information, benefits, and submit requests',
        url: '/hr-portal',
        categories: ['Resources'],
        icon: '👥',
        tags: ['HR', 'benefits', 'requests', 'employee services']
      },
      {
        id: '4',
        name: 'IT Support Desk',
        description: 'Submit IT support requests and track ticket status',
        url: '/it-support',
        categories: ['IT'],
        icon: '🛠️',
        tags: ['IT', 'support', 'tickets', 'helpdesk']
      },
      {
        id: '5',
        name: 'Project Management Hub',
        description: 'Central hub for all company projects and initiatives',
        url: '/projects',
        categories: ['Resources'],
        icon: '📊',
        tags: ['projects', 'management', 'tracking', 'collaboration']
      },
      {
        id: '6',
        name: 'Analytics Dashboard',
        description: 'Business intelligence and reporting dashboard',
        url: '/analytics',
        categories: ['Resources'],
        icon: '📈',
        tags: ['analytics', 'reports', 'data', 'business intelligence']
      },
      {
        id: '8',
        name: 'Production Systems',
        description: 'Monitoring and status for all production services.',
        url: '/production',
        categories: ['Production'],
        icon: '⚙️',
        tags: ['production', 'monitoring', 'status', 'services']
      },
      {
        id: '9',
        name: 'Access Management',
        description: 'Request or manage access permissions for enterprise systems.',
        url: '/access',
        categories: ['Access'],
        icon: '🔑',
        tags: ['access', 'permissions', 'security', 'requests']
      },
      {
        id: '10',
        name: 'Sales Quoting Tool',
        description: 'Create and manage customer quotations and proposals.',
        url: '/quoting',
        categories: ['Quotation'],
        icon: '💲',
        tags: ['sales', 'quotes', 'proposals', 'pricing']
      },
      {
        id: '11',
        name: 'Admin Dashboard',
        description: 'Central dashboard for administrative tasks and system management.',
        url: '/admin',
        categories: ['Admin'],
        icon: '🧑‍💼',
        tags: ['admin', 'management', 'configuration', 'settings']
      },

      // External tools that need metadata fetching
      {
        id: '7',
        url: 'https://cortex5.ipsos.com/',
        name: 'Loading...',
        description: 'The Cortex platform for data analysis and visualization.', // Keep original description
        categories: ['Resources'],
        isLoading: true,
        tags: ['cortex', 'data', 'analysis']
      },
      {
        id: `external_sample`,
        url: 'https://sample.ipsos.com',
        name: 'Loading...',
        isLoading: true,
        categories: ['Other']
      }
    ];

    setTools(initialTools);

    // Fetch metadata for all tools marked as `isLoading`
    initialTools.forEach(async (tool) => {
      if (tool.isLoading) {
        try {
          const metadata = await fetchWebsiteMetadata(tool.url);
          setTools(prev => prev.map(t => 
            t.id === tool.id ? {
              ...t,
              name: metadata.title || getHostnameSafely(tool.url),
              icon: metadata.favicon, // Use icon field for favicon URL
              favicon: metadata.favicon, // Also keep it in favicon for original ToolCard
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
      }
    });
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const toggleFavorite = (tool: Tool) => {
    if (isFavorite(tool.id)) {
      removeFavoriteTool(tool.id);
    } else {
      addFavoriteTool(tool);
    }
  };
  
  const toggleDashboard = (tool: Tool) => {
    if (isToolInDashboard(tool.id)) {
      removeToolFromDashboard(tool.id);
    } else {
      addToolToDashboard(tool);
    }
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const categories = ['Resources', 'Production', 'Access', 'Quotation', 'Admin', 'IT', 'PM', 'SW', 'QE', 'Product', 'Other'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>Enterprise Tools</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>Discover and organize your company\'s digital tools and resources</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1rem 1.5rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MagnifyingGlassIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            <input type="text" placeholder="Search tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}/>
          </div>
        </div>

        {favoriteTools.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StarIconSolid style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
              Favorite Tools ({favoriteTools.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {favoriteTools.map((favTool) => {
                const fullTool = tools.find(t => t.id === favTool.id);
                if (!fullTool) return null;
                const cardProps = { tool: fullTool, isFavorite: true, onToggleFavorite: toggleFavorite };
                return fullTool.categories.includes('Resources') ? <ResourceCard key={`fav-${fullTool.id}`} {...cardProps} /> : <ToolCard key={`fav-${fullTool.id}`} {...cardProps} isDashboard={isToolInDashboard(fullTool.id)} onToggleDashboard={toggleDashboard} />;
              })}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>All Tools ({tools.length})</h2>
          {categories.map(category => {
            const toolsForCategory = filteredTools.filter(tool => tool.categories && tool.categories.includes(category));
            if (toolsForCategory.length === 0) return null;
            const isCollapsed = collapsedCategories.includes(category);
            return (
              <div key={category} style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggleCategory(category)}>
                  {isCollapsed ? <ChevronRightIcon style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} /> : <ChevronDownIcon style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />}
                  {category}
                </h3>
                {!isCollapsed && (
                  <div style={{ display: 'grid', gridTemplateColumns: category === 'Resources' ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: category === 'Resources' ? '1rem' : '0.75rem' }}>
                    {toolsForCategory.map((tool) => {
                       const cardProps = { tool, isFavorite: isFavorite(tool.id), onToggleFavorite: toggleFavorite };
                       return category === 'Resources' ? <ResourceCard key={tool.id} {...cardProps} /> : <ToolCard key={tool.id} {...cardProps} isDashboard={isToolInDashboard(tool.id)} onToggleDashboard={toggleDashboard} />;
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (tool: Tool) => void;
}

const ResourceCard: React.FC<CardProps> = ({ tool, isFavorite, onToggleFavorite }) => {
  const handleToolClick = () => { if(!tool.isLoading) window.open(tool.url, '_blank', 'noopener,noreferrer'); };

  const iconContent = () => {
    if (tool.isLoading) return '⏳';
    if (tool.icon) {
      if (tool.icon.startsWith('http') || tool.icon.startsWith('/')) {
        return <img src={tool.icon} alt={tool.name} style={{width: '32px', height: '32px'}} />;
      }
      return tool.icon; // Emoji
    }
    return '🔗';
  }

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.1)', opacity: tool.isLoading ? 0.7 : 1, backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '1.5rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease', maxWidth: '350px' }}
      onMouseEnter={(e) => { if(!tool.isLoading) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
      onMouseLeave={(e) => { if(!tool.isLoading) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; } }}>
      <div onClick={handleToolClick} style={{cursor: 'pointer'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '2rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{iconContent()}</div>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{tool.name}</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: 0 }}>{tool.categories.join(', ')}</p>
            </div>
          </div>
          {!tool.isLoading && (
            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
              {isFavorite ? <StarIconSolid style={{ width: '20px', height: '20px', color: '#fbbf24' }} /> : <StarIcon style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />}
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem', opacity: 0.9, margin: '0 0 1rem 0' }}>{tool.description}</p>
      </div>
      {!tool.isLoading && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', opacity: 0.7 }}>
          <LinkIcon style={{ width: '16px', height: '16px' }} />
          <span>{getHostnameSafely(tool.url)}</span>
        </div>
        <button onClick={handleToolClick} style={{ background: 'rgba(59, 130, 246, 0.8)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>Open →</button>
      </div>}
    </div>
  );
};

interface ToolCardProps extends CardProps {
  isDashboard: boolean;
  onToggleDashboard: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorite, onToggleFavorite, isDashboard, onToggleDashboard }) => {
  const handleToolClick = () => { if (!tool.isLoading) window.open(tool.url, '_blank', 'noopener,noreferrer'); };
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; const fallback = e.currentTarget.parentElement?.querySelector('span'); if (fallback) fallback.style.display = 'block'; };

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.75rem', cursor: tool.isLoading ? 'default' : 'pointer', transition: 'all 0.3s ease', color: 'white', opacity: tool.isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.75rem', height: '60px', maxWidth: '300px' }}
      onMouseEnter={(e) => { if (!tool.isLoading) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      onClick={handleToolClick}>
      <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {tool.favicon && !tool.isLoading ? (
          <><img src={tool.favicon} alt="favicon" style={{ width: '24px', height: '24px', display: 'block' }} onError={handleImageError} /><span style={{ display: 'none', fontSize: '1.2rem' }}>{'🔗'}</span></>
        ) : (
          <span style={{ display: 'block', fontSize: '1.2rem' }}>{tool.isLoading ? '⏳' : '🔗'}</span>
        )}
      </div>
      <h3 style={{ fontWeight: '500', fontSize: '0.9rem', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tool.name}</h3>
      {!tool.isLoading && (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}>
              {isFavorite ? <StarIconSolid style={{ width: '16px', height: '16px', color: '#fbbf24' }} /> : <StarIcon style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.6)' }} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleDashboard(tool); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}>
              {isDashboard ? <PlusIconSolid style={{ width: '16px', height: '16px', color: '#fbbf24' }} /> : <PlusIcon style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.6)' }} />}
            </button>
        </div>
      )}
    </div>
  );
};

export default Tools;
