import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'document' | 'wiki' | 'sharepoint' | 'intranet';
  source: string;
  url: string;
  lastModified: string;
  relevance: number;
  tags?: string[];
  author?: string;
  department?: string;
  categories?: string[];
}

interface SearchContextType {
  searchResults: SearchResult[];
  isLoading: boolean;
  query: string;
  performSearch: (searchQuery: string) => Promise<SearchResult[]>;
  clearResults: () => void;
  setSearchResults: (results: SearchResult[]) => void;
  setQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const performSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    setIsLoading(true);
    setQuery(searchQuery);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockDatabase: SearchResult[] = [
      {
        id: '1',
        title: 'Employee Handbook 2025',
        excerpt: 'Complete guide for new employees including company policies, benefits information, remote work guidelines, and organizational structure. Covers onboarding procedures, dress code, vacation policies, and performance review processes.',
        type: 'document',
        source: 'SharePoint',
        url: '/documents/employee-handbook',
        lastModified: '2 days ago',
        relevance: 95,
        tags: ['HR', 'policies', 'onboarding', 'benefits', 'handbook'],
        author: 'HR Team',
        department: 'Human Resources',
        categories: ['Resources']
      },
      {
        id: '2',
        title: 'IT Security Policies and Procedures',
        excerpt: 'Comprehensive cybersecurity guidelines including password requirements, VPN setup, data protection protocols, incident response procedures, and compliance frameworks. Updated with latest security standards and best practices.',
        type: 'wiki',
        source: 'Internal Wiki',
        url: '/wiki/security-policies',
        lastModified: '1 week ago',
        relevance: 88,
        tags: ['IT', 'security', 'compliance', 'passwords', 'VPN', 'data protection'],
        author: 'IT Security Team',
        department: 'Information Technology',
        categories: ['Admin']
      },
      {
        id: '3',
        title: 'Project Alpha Technical Documentation',
        excerpt: 'Technical specifications, development timeline, team assignments, and milestone tracking for the Alpha initiative. Includes API documentation, database schemas, and deployment procedures.',
        type: 'sharepoint',
        source: 'Project Hub',
        url: '/projects/alpha/docs',
        lastModified: '3 days ago',
        relevance: 82,
        tags: ['project', 'documentation', 'alpha', 'technical', 'API'],
        author: 'Project Manager',
        department: 'Engineering',
        categories: ['SW', 'PM']
      },
      {
        id: '4',
        title: 'Company Travel and Expense Policy',
        excerpt: 'Guidelines for business travel, expense reporting, reimbursement procedures, and approved vendors. Includes travel booking procedures, per diem rates, and receipt requirements.',
        type: 'document',
        source: 'SharePoint',
        url: '/policies/travel-expenses',
        lastModified: '1 week ago',
        relevance: 75,
        tags: ['travel', 'expenses', 'policy', 'reimbursement', 'finance'],
        author: 'Finance Team',
        department: 'Finance',
        categories: ['Admin']
      },
      {
        id: '5',
        title: 'Remote Work Best Practices',
        excerpt: 'Guidelines for effective remote work including communication protocols, productivity tools, meeting etiquette, and work-life balance recommendations for distributed teams.',
        type: 'wiki',
        source: 'Internal Wiki',
        url: '/wiki/remote-work',
        lastModified: '5 days ago',
        relevance: 78,
        tags: ['remote work', 'productivity', 'communication', 'best practices'],
        author: 'Operations Team',
        department: 'Operations',
        categories: ['Resources']
      },
      {
        id: '6',
        title: 'Software Development Lifecycle Guidelines',
        excerpt: 'Standard procedures for software development including code review processes, testing requirements, deployment pipelines, and quality assurance protocols.',
        type: 'wiki',
        source: 'Development Wiki',
        url: '/dev/sdlc-guidelines',
        lastModified: '4 days ago',
        relevance: 85,
        tags: ['development', 'SDLC', 'code review', 'testing', 'deployment'],
        author: 'Tech Lead',
        department: 'Engineering',
        categories: ['SW', 'QE', 'PM']
      },
      {
        id: '7',
        title: 'Customer Support Knowledge Base',
        excerpt: 'Comprehensive troubleshooting guides, FAQs, and customer service procedures. Includes escalation processes, ticket management, and customer communication templates.',
        type: 'intranet',
        source: 'Support Portal',
        url: '/support/knowledge-base',
        lastModified: '2 days ago',
        relevance: 80,
        tags: ['customer support', 'troubleshooting', 'FAQ', 'tickets'],
        author: 'Support Team',
        department: 'Customer Support',
        categories: ['Resources']
      },
      {
        id: '8',
        title: 'Marketing Campaign Planning Process',
        excerpt: 'Step-by-step guide for planning and executing marketing campaigns including budget allocation, content creation, timeline management, and performance metrics.',
        type: 'document',
        source: 'Marketing Hub',
        url: '/marketing/campaign-planning',
        lastModified: '1 week ago',
        relevance: 77,
        tags: ['marketing', 'campaigns', 'planning', 'budget', 'metrics'],
        author: 'Marketing Team',
        department: 'Marketing',
        categories: ['Product']
      }
    ];

    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 1);
    
    const filteredResults = mockDatabase
      .map(result => {
        let score = 0;
        const title = result.title.toLowerCase();
        const excerpt = result.excerpt.toLowerCase();
        const tags = result.tags?.join(' ').toLowerCase() || '';
        const department = result.department?.toLowerCase() || '';
        
        searchTerms.forEach(term => {
          if (title.includes(term)) score += 10;
          if (excerpt.includes(term)) score += 3;
          if (tags.includes(term)) score += 5;
          if (department.includes(term)) score += 4;
        });
        
        return { ...result, relevance: Math.min(100, score * 10) };
      })
      .filter(result => result.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

    let results: SearchResult[];
    if (filteredResults.length === 0) {
      results = [
        {
          id: 'suggestion-1',
          title: 'Search Suggestion: Try Common Topics',
          excerpt: `No exact matches found for "${searchQuery}". Try searching for common topics like: employee policies, security guidelines, project documentation, travel expenses, or remote work procedures.`,
          type: 'document',
          source: 'Search Help',
          url: '/help/search-tips',
          lastModified: 'now',
          relevance: 50,
          tags: ['help', 'suggestions'],
          author: 'System',
          department: 'Help'
        }
      ];
    } else {
      results = filteredResults;
    }

    setSearchResults(results);
    setIsLoading(false);
    return results;
  };

  const clearResults = () => {
    setSearchResults([]);
    setQuery('');
  };

  const value: SearchContextType = {
    searchResults,
    isLoading,
    query,
    performSearch,
    clearResults,
    setSearchResults,
    setQuery
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
