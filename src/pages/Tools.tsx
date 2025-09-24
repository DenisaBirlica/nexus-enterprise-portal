import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  StarIcon,
  PlusIcon,
  LinkIcon,
  FunnelIcon
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [tools, setTools] = useState<Tool[]>([]);
  const { 
    favoriteTools, addFavoriteTool, removeFavoriteTool, isFavorite, 
    isToolInDashboard, addToolToDashboard, removeToolFromDashboard 
  } = useApp();

  useEffect(() => {
    const initialTools: Tool[] = [
      // Internal tools with real URLs
      {
        id: '1',
        name: 'SharePoint Portal',
        description: 'Central document management and collaboration platform for all company files',
        url: 'https://ipsosgroup-my.sharepoint.com/',
        categories: ['Resources'],
        icon: '📄',
        tags: ['documents', 'collaboration', 'files', 'sharepoint']
      },
      {
        id: '2',
        name: 'Internal Wiki',
        description: 'Company knowledge base and documentation repository',
        url: 'https://kb-new.ipsosinteractive.com',
        categories: ['Resources'],
        icon: '📖',
        tags: ['wiki', 'documentation', 'knowledge', 'procedures']
      },
      {
        id: '8',
        name: 'Intranet',
        description: 'Company intranet portal for internal communications and resources',
        url: 'https://intranet.ipsos.com/_/ro/home',
        categories: ['Resources'],
        icon: '🏢',
        tags: ['intranet', 'internal', 'communications', 'company portal']
      },
      {
        id: '4',
        name: 'iService',
        description: 'IT support and service request management system',
        url: 'https://ipsos.service-now.com/ess',
        categories: ['IT'],
        icon: '🛠️',
        tags: ['IT', 'support', 'service', 'tickets', 'helpdesk', 'service-now']
      },
      {
        id: '5',
        name: 'IpsosFacto',
        description: 'AI-powered platform - aggregator of large language models for enhanced productivity',
        url: 'https://prod.ipsosfacto.com/login',
        categories: ['AI'],
        icon: '🤖',
        tags: ['AI', 'LLM', 'artificial intelligence', 'productivity', 'aggregator']
      },
      {
        id: '9',
        name: 'iTime',
        description: 'Time tracking and timesheet management system for project hours',
        url: 'https://itime.ipsos.com/iTime_Romania/TmCrdForm.cfm?TmCrfID=0',
        categories: ['HR'],
        icon: '⏰',
        tags: ['time tracking', 'timesheet', 'hours', 'projects', 'itime']
      },
      {
        id: '10',
        name: 'iQuote',
        description: 'Professional quoting system for creating and managing customer quotations and proposals',
        url: 'https://nwb.ipsos.com/iquote/search/#external',
        categories: ['Quotation'],
        icon: '💲',
        tags: ['quotes', 'proposals', 'pricing', 'sales', 'iquote']
      },
      {
        id: '11',
        name: 'iTalent',
        description: 'HR platform for performance evaluations, training center (ITC), and talent management',
        url: 'https://ecqf.fa.em2.oraclecloud.com/hcmUI/faces/HcmFusionHome',
        categories: ['HR'],
        icon: '🎯',
        tags: ['HR', 'performance', 'evaluations', 'training', 'ITC', 'talent management', 'oracle']
      },
      {
        id: '13',
        name: 'EU Transfer',
        description: 'LiquidFile system for secure file transfers and document sharing',
        url: 'https://eutransfer.ipsos.com/',
        categories: ['IT'],
        icon: '🔐',
        tags: ['file transfer', 'secure', 'documents', 'liquidfile', 'sharing']
      },
      {
        id: '14',
        name: 'Brasov Ipsos Parking',
        description: 'Parking reservation app for booking office parking spots in Brasov',
        url: 'https://ipsosroparking.web.app/',
        categories: ['Office'],
        icon: '🅿️',
        tags: ['parking', 'reservation', 'brasov', 'office', 'booking']
      },
      {
        id: '15',
        name: 'JB (Symphony)',
        description: 'Finance tool for managing proposals, budgets, invoicing and financial operations',
        url: 'https://symprod.ipsos.com',
        categories: ['Quotation'],
        icon: '💰',
        tags: ['finance', 'proposals', 'budgets', 'invoicing', 'symphony', 'JB']
      },
      {
        id: '16',
        name: 'Signals',
        description: 'Ipsos Synthesio - AI-powered social media listening and analytics platform',
        url: 'https://app.synthesio.com/dashboard-v5/client/4114/workspaces/38469',
        categories: ['AI'],
        icon: '📊',
        tags: ['synthesio', 'social media', 'analytics', 'listening', 'AI', 'signals']
      },
      {
        id: '17',
        name: 'Dimensions',
        description: 'Software development and quality assurance platform',
        url: 'https://online751-prod.ipsosinteractive.com',
        categories: ['SW'],
        icon: '⚡',
        tags: ['software', 'development', 'QA', 'quality assurance', 'dimensions']
      },
      {
        id: '18',
        name: 'Harmoni',
        description: 'Data processing and project management platform',
        url: 'https://ipsoslogin-us.harmoni.online/App/Main/#/?eyJSZXR1cm5VcmwiOiJodHRwczovL2lwc29zbG9naW4uYmh0Lmhhcm1vbmkub25saW5lL1NpdGVzL1JlZ2lzdHJhdGlvbi9pbmRleC5odG1sIiwiQ3VzdG9tVGhlbWUiOiJpcHNvcyJ9',
        categories: ['DP'],
        icon: '🎵',
        tags: ['data processing', 'project management', 'harmoni', 'DP']
      },

      // External tools that need metadata fetching (ordered after iQuote)
      {
        id: '3',
        url: 'https://app.colorful.hr/#8daaf10-15c4-41f9-be53-545184b962f7',
        name: 'Loading...',
        description: 'HR self-service portal for employee benefits, requests, and information',
        categories: ['HR'],
        isLoading: true,
        tags: ['HR', 'benefits', 'requests', 'employee services', 'colorful']
      },
      {
        id: '6',
        url: 'https://bi.ipsos.com',
        name: 'Loading...',
        description: 'Business intelligence and reporting dashboard for data analytics',
        categories: ['Analytics'],
        isLoading: true,
        tags: ['BI', 'business intelligence', 'analytics', 'reports', 'data']
      },
      {
        id: '12',
        url: 'https://app.benefit.edenred.ro/',
        name: 'Loading...',
        description: 'Employee benefits platform for meal vouchers and other benefits',
        categories: ['HR'],
        isLoading: true,
        tags: ['benefits', 'meal vouchers', 'edenred', 'employee perks']
      },
      // S1 and Cortex moved after iQuote
      {
        id: `s1_sample`,
        url: 'https://sample.ipsos.com',
        name: 'Loading...',
        description: 'Sampling Platform for survey research and data collection',
        categories: ['PM'],
        isLoading: true,
        tags: ['sampling', 'survey', 'research', 'data collection', 'S1']
      },
      {
        id: '7',
        url: 'https://cortex5.ipsos.com/',
        name: 'Loading...',
        description: 'Smart Field Management System for research operations',
        categories: ['PM'],
        isLoading: true,
        tags: ['cortex', 'field management', 'research operations', 'project management', 'smart']
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
              icon: metadata.favicon,
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
      }
    });
  }, []);

  // Get all unique categories from tools
  const allCategories = ['All', ...Array.from(new Set(tools.flatMap(tool => tool.categories)))];

  // Filter tools based on search query and selected category
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'All' || tool.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

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

        {/* Search and Filter Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Search Input */}
          <div style={{ 
            flex: 1,
            minWidth: '300px',
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
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1rem 1.5rem', 
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            minWidth: '200px'
          }}>
            <FunnelIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ 
                flex: 1, 
                border: 'none', 
                outline: 'none', 
                fontSize: '1rem', 
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category} {category !== 'All' && `(${tools.filter(t => t.categories.includes(category)).length})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
            {selectedCategory === 'All' ? 'All Tools' : selectedCategory} ({filteredTools.length})
          </h2>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'rgba(255, 255, 255, 0.8)',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No tools found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem'
          }}>
            {filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool}
                isFavorite={isFavorite(tool.id)}
                onToggleFavorite={toggleFavorite}
                isDashboard={isToolInDashboard(tool.id)}
                onToggleDashboard={toggleDashboard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (tool: Tool) => void;
  isDashboard: boolean;
  onToggleDashboard: (tool: Tool) => void;
}

const ToolCard: React.FC<CardProps> = ({ tool, isFavorite, onToggleFavorite, isDashboard, onToggleDashboard }) => {
  const handleToolClick = () => { 
    if(!tool.isLoading) window.open(tool.url, '_blank', 'noopener,noreferrer'); 
  };

  const iconContent = () => {
    if (tool.isLoading) return '⏳';
    if (tool.icon) {
      if (tool.icon.startsWith('http') || tool.icon.startsWith('/')) {
        return <img src={tool.icon} alt={tool.name} style={{width: '32px', height: '32px'}} />;
      }
      return tool.icon; // Emoji
    }
    return '🔗';
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.1)', 
      opacity: tool.isLoading ? 0.7 : 1, 
      backdropFilter: 'blur(10px)', 
      border: '1px solid rgba(255, 255, 255, 0.2)', 
      borderRadius: '16px', 
      padding: '1.5rem', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      transition: 'all 0.3s ease', 
      minHeight: '200px'
    }}
      onMouseEnter={(e) => { 
        if(!tool.isLoading) { 
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; 
          e.currentTarget.style.transform = 'translateY(-2px)'; 
        }
      }}
      onMouseLeave={(e) => { 
        if(!tool.isLoading) { 
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; 
          e.currentTarget.style.transform = 'translateY(0)'; 
        } 
      }}
    >
      <div onClick={handleToolClick} style={{cursor: tool.isLoading ? 'default' : 'pointer', flex: 1}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <div style={{ fontSize: '2rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {iconContent()}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{tool.name}</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: 0 }}>{tool.categories.join(', ')}</p>
            </div>
          </div>
          {!tool.isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool); }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                {isFavorite ? (
                  <StarIconSolid style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                ) : (
                  <StarIcon style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
                )}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleDashboard(tool); }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                {isDashboard ? (
                  <PlusIconSolid style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                ) : (
                  <PlusIcon style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
                )}
              </button>
            </div>
          )}
        </div>
        {tool.description && (
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem', opacity: 0.9, margin: '0 0 1rem 0' }}>
            {tool.description}
          </p>
        )}
      </div>
      {!tool.isLoading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', opacity: 0.7 }}>
            <LinkIcon style={{ width: '16px', height: '16px' }} />
            <span>{getHostnameSafely(tool.url)}</span>
          </div>
          <button 
            onClick={handleToolClick} 
            style={{ 
              background: 'rgba(59, 130, 246, 0.8)', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              cursor: 'pointer' 
            }}
          >
            Open →
          </button>
        </div>
      )}
    </div>
  );
};

export default Tools;