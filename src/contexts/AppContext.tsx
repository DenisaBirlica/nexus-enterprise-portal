import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { generateUUID } from '../utils/uuid'; // Import the original UUID function

interface FavoriteTool {
  id: string;
  name: string;
  url: string;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  searchResults?: any[];
}

interface Conversation {
  id: string;
  messages: ConversationMessage[];
  title: string;
  lastUpdated: number;
  starred?: boolean;
}

interface AppContextType {
  favoriteTools: FavoriteTool[];
  conversations: Conversation[];
  starredConversations: Conversation[];
  addFavoriteTool: (tool: FavoriteTool) => void;
  removeFavoriteTool: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  createConversation: (title?: string) => string;
  addMessageToConversation: (conversationId: string, message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
  toggleStarConversation: (conversationId: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [favoriteTools, setFavoriteTools] = useState<FavoriteTool[]>(() => {
    const saved = localStorage.getItem('nexus-favorite-tools');
    return saved ? JSON.parse(saved) : [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('nexus-conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const starredConversations = conversations.filter(conv => conv.starred);

  useEffect(() => {
    localStorage.setItem('nexus-favorite-tools', JSON.stringify(favoriteTools));
  }, [favoriteTools]);

  useEffect(() => {
    localStorage.setItem('nexus-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const addFavoriteTool = (tool: FavoriteTool) => {
    setFavoriteTools(prev => {
      const exists = prev.find(t => t.id === tool.id);
      if (exists) return prev;
      return [...prev, tool];
    });
  };

  const removeFavoriteTool = (toolId: string) => {
    setFavoriteTools(prev => prev.filter(tool => tool.id !== toolId));
  };

  const isFavorite = (toolId: string): boolean => {
    return favoriteTools.some(tool => tool.id === toolId);
  };

  const createConversation = (title?: string): string => {
    const conversationId = generateUUID(); // Use original UUID format
    
    const newConversation: Conversation = {
      id: conversationId,
      messages: [],
      title: title || 'New conversation',
      lastUpdated: Date.now(),
      starred: false
    };

    setConversations(prev => [newConversation, ...prev].slice(0, 100));
    return conversationId;
  };

  const addMessageToConversation = (conversationId: string, message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: ConversationMessage = {
          ...message,
          id: generateUUID(), // Use original UUID format
          timestamp: Date.now()
        };
        
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastUpdated: Date.now()
        };

        if (conv.messages.length === 0 && message.type === 'user' && conv.title === 'New conversation') {
          updatedConv.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
        }

        return updatedConv;
      }
      return conv;
    }));
  };

  const updateConversationTitle = (conversationId: string, title: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, title, lastUpdated: Date.now() } : conv
    ));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
  };

  const toggleStarConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, starred: !conv.starred, lastUpdated: Date.now() } : conv
    ));
  };

  const getConversation = (conversationId: string): Conversation | undefined => {
    return conversations.find(conv => conv.id === conversationId);
  };

  const value: AppContextType = {
    favoriteTools,
    conversations,
    starredConversations,
    addFavoriteTool,
    removeFavoriteTool,
    isFavorite,
    createConversation,
    addMessageToConversation,
    updateConversationTitle,
    deleteConversation,
    toggleStarConversation,
    getConversation
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};