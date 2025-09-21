import React from 'react';
import { 
  DocumentTextIcon, 
  FolderIcon, 
  BuildingOffice2Icon,
  ClockIcon,
  LinkIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface SearchResultsProps {
  results?: any[];
  query?: string;
  isLoading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-skeleton">
          <div className="skeleton-line title"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-line medium"></div>
        </div>
        
        {[...Array(3)].map((_, index) => (
          <div key={index} className="loading-skeleton">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="no-results">
        <GlobeAltIcon className="no-results-icon" />
        <h3>No results found{query ? ` for "${query}"` : ''}</h3>
        <p>Try searching for "employee", "security", or "project"</p>
      </div>
    );
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return DocumentTextIcon;
      case 'wiki':
        return FolderIcon;
      case 'sharepoint':
        return BuildingOffice2Icon;
      default:
        return DocumentTextIcon;
    }
  };

  return (
    <div>
      {/* AI Summary Section */}
      <div className="results-container">
        <div className="summary-section">
          <div className="summary-header">
            <div className="nexus-icon">N</div>
            <h2 className="summary-title">Summary</h2>
          </div>
          
          <div className="summary-content">
            <p>
              {query ? (
                <>Based on your search for "{query}", I found {results.length} relevant resources 
                across your enterprise systems. Here's what I discovered:</>
              ) : (
                <>I found {results.length} relevant resources across your enterprise systems. 
                Here's what I discovered:</>
              )}
            </p>
            <p>
              The information spans multiple departments and includes comprehensive documentation, 
              policies, and procedures that can help you with your inquiry.
            </p>
          </div>

          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{results.length}</span>
              <span>sources found</span>
            </div>
            <div className="stat-item">
              <ClockIcon className="icon-sm" />
              <span>Recently updated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Section */}
      <div className="results-container">
        <div className="sources-section">
          <div className="sources-header">
            <LinkIcon className="icon" />
            <h3 className="sources-title">Sources</h3>
          </div>
          
          <div>
            {results.map((result, index) => {
              const SourceIcon = getSourceIcon(result.type);
              
              return (
                <div
                  key={result.id}
                  className={`source-item ${result.type}`}
                >
                  <div className="source-header">
                    <div className="source-info">
                      <div className="source-title-row">
                        <SourceIcon className="icon-sm" />
                        <h4 className="source-title">{result.title}</h4>
                        <span className="source-badge">{result.source}</span>
                      </div>
                      
                      <p className="source-excerpt">{result.excerpt}</p>
                      
                      <div className="source-meta">
                        {result.department && (
                          <span className="source-badge">{result.department}</span>
                        )}
                        {result.author && <span>by {result.author}</span>}
                        <span>{result.lastModified}</span>
                        <span className="flex items-center gap-2">
                          <span style={{
                            width: '8px',
                            height: '8px',
                            background: '#10b981',
                            borderRadius: '50%'
                          }}></span>
                          <span>{result.relevance}% match</span>
                        </span>
                      </div>
                    </div>
                    
                    <LinkIcon className="icon-sm" style={{ color: '#9ca3af', marginLeft: '0.5rem' }} />
                  </div>

                  {result.tags && result.tags.length > 0 && (
                    <div className="source-tags">
                      {result.tags.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;