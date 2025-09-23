import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { generateUUID } from '../utils/uuid';

// --- Base Types ---
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

// --- Dashboard & Spaces Types ---
export interface DashboardLink {
    id: string;
    name: string;
    url: string;
}

export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export interface Note {
    text: string;
    color: string;
}

export type SpaceType = 'links' | 'itime-reminder' | 'world-clock' | 'todo' | 'note';

export interface Space {
    id: string;
    name: string;
    type: SpaceType;
    content: any;
}

// --- Context Type ---
interface AppContextType {
  favoriteTools: FavoriteTool[];
  conversations: Conversation[];
  starredConversations: Conversation[];
  dashboardSpaces: Space[];

  // Favorites
  addFavoriteTool: (tool: FavoriteTool) => void;
  removeFavoriteTool: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;

  // Conversations
  createConversation: (title?: string) => string;
  addMessageToConversation: (conversationId: string, message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
  toggleStarConversation: (conversationId: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;

  // Dashboard Spaces
  addSpace: (name: string, type: SpaceType) => void;
  removeSpace: (spaceId: string) => void;
  updateSpace: (space: Space) => void;
  reorderDashboardSpaces: (draggedId: string, targetId: string) => void;
  addLinkToSpace: (spaceId: string, link: Omit<DashboardLink, 'id'>) => void;
  removeLinkFromSpace: (spaceId: string, linkId: string) => void;
  addTaskToSpace: (spaceId: string, text: string) => void;
  toggleTaskInSpace: (spaceId: string, taskId: string) => void;
  removeTaskFromSpace: (spaceId: string, taskId: string) => void;
  updateNoteInSpace: (spaceId: string, note: Note) => void;
  isToolInDashboard: (toolId: string) => boolean;
  addToolToDashboard: (tool: FavoriteTool) => void;
  removeToolFromDashboard: (toolId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// --- Provider Component ---
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // --- State Initializations ---
  const [favoriteTools, setFavoriteTools] = useState<FavoriteTool[]>(() => {
    const saved = localStorage.getItem('nexus-favorite-tools');
    return saved ? JSON.parse(saved) : [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('nexus-conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const [dashboardSpaces, setDashboardSpaces] = useState<Space[]>(() => {
    const saved = localStorage.getItem('nexus-dashboard-spaces');
    if (saved) return JSON.parse(saved);

    return [
        { id: generateUUID(), name: "Personal Links", type: "links", content: [] },
        { id: generateUUID(), name: "Q3 Goals", type: "todo", content: [{id: generateUUID(), text: 'Finalize project proposal', completed: false}] },
        { id: generateUUID(), name: "Time Tracking", type: "itime-reminder", content: { lastSubmitted: '2024-07-22' } },
        { id: generateUUID(), name: "Global Clocks", type: "world-clock", content: { timezones: ['America/New_York', 'Europe/London', 'Asia/Tokyo'] } },
    ];
  });

  const starredConversations = conversations.filter(conv => conv.starred);

  // --- LocalStorage Effects ---
  useEffect(() => {
    localStorage.setItem('nexus-favorite-tools', JSON.stringify(favoriteTools));
  }, [favoriteTools]);

  useEffect(() => {
    localStorage.setItem('nexus-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('nexus-dashboard-spaces', JSON.stringify(dashboardSpaces));
  }, [dashboardSpaces]);

  // --- Favorite Tools Methods ---
  const addFavoriteTool = (tool: FavoriteTool) => {
    setFavoriteTools(prev => prev.find(t => t.id === tool.id) ? prev : [...prev, tool]);
  };

  const removeFavoriteTool = (toolId: string) => {
    setFavoriteTools(prev => prev.filter(tool => tool.id !== toolId));
  };

  const isFavorite = (toolId: string): boolean => favoriteTools.some(tool => tool.id === toolId);

  // --- Conversation Methods ---
   const createConversation = (title?: string): string => {
    const conversationId = generateUUID();
    const newConversation: Conversation = {
      id: conversationId, messages: [],
      title: title || 'New conversation', lastUpdated: Date.now(), starred: false
    };
    setConversations(prev => [newConversation, ...prev].slice(0, 100));
    return conversationId;
  };

  const addMessageToConversation = (conversationId: string, message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: ConversationMessage = { ...message, id: generateUUID(), timestamp: Date.now() };
        const updatedConv = { ...conv, messages: [...conv.messages, newMessage], lastUpdated: Date.now() };
        if (conv.messages.length === 0 && message.type === 'user' && conv.title === 'New conversation') {
          updatedConv.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
        }
        return updatedConv;
      }
      return conv;
    }));
  };

  const updateConversationTitle = (conversationId: string, title: string) => {
    setConversations(prev => prev.map(conv => conv.id === conversationId ? { ...conv, title, lastUpdated: Date.now() } : conv));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
  };

  const toggleStarConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => conv.id === conversationId ? { ...conv, starred: !conv.starred, lastUpdated: Date.now() } : conv));
  };

  const getConversation = (conversationId: string): Conversation | undefined => conversations.find(conv => conv.id === conversationId);

  // --- Dashboard Spaces Methods ---
  const addSpace = (name: string, type: SpaceType) => {
    let content: any;
    switch (type) {
        case 'links': content = []; break;
        case 'todo': content = []; break;
        case 'note': content = { text: '', color: 'rgba(0,0,0,0.2)' }; break;
        case 'world-clock': content = { timezones: ['America/New_York', 'Europe/London', 'Asia/Tokyo'] }; break;
        case 'itime-reminder': content = { lastSubmitted: '2024-07-22' }; break;
        default: content = {};
    }
    const newSpace: Space = { id: generateUUID(), name, type, content };
    setDashboardSpaces(prev => [...prev, newSpace]);
  };

  const removeSpace = (spaceId: string) => {
    setDashboardSpaces(prev => prev.filter(space => space.id !== spaceId));
  };

  const updateSpace = (updatedSpace: Space) => {
    setDashboardSpaces(prev => prev.map(space => space.id === updatedSpace.id ? updatedSpace : space));
  };

  const reorderDashboardSpaces = (draggedId: string, targetId: string) => {
    setDashboardSpaces(prev => {
        const draggedIdx = prev.findIndex(s => s.id === draggedId);
        const targetIdx = prev.findIndex(s => s.id === targetId);
        if (draggedIdx === -1 || targetIdx === -1) return prev;
        
        const newSpaces = [...prev];
        const [draggedItem] = newSpaces.splice(draggedIdx, 1);
        newSpaces.splice(targetIdx, 0, draggedItem);
        return newSpaces;
    });
  };

  const addLinkToSpace = (spaceId: string, link: Omit<DashboardLink, 'id'>) => {
    setDashboardSpaces(prev => prev.map(space => {
      if (space.id === spaceId && space.type === 'links') {
        const newLink: DashboardLink = { ...link, id: `custom-${generateUUID()}` };
        return { ...space, content: [...space.content, newLink] };
      }
      return space;
    }));
  };

  const removeLinkFromSpace = (spaceId: string, linkId: string) => {
    setDashboardSpaces(prev => prev.map(space => {
      if (space.id === spaceId && space.type === 'links') {
        return { ...space, content: space.content.filter((link: DashboardLink) => link.id !== linkId) };
      }
      return space;
    }));
  };

  const addTaskToSpace = (spaceId: string, text: string) => {
      setDashboardSpaces(prev => prev.map(space => {
          if (space.id === spaceId && space.type === 'todo') {
              const newTask: Task = { id: generateUUID(), text, completed: false };
              return { ...space, content: [...space.content, newTask] };
          }
          return space;
      }));
  };

  const toggleTaskInSpace = (spaceId: string, taskId: string) => {
      setDashboardSpaces(prev => prev.map(space => {
          if (space.id === spaceId && space.type === 'todo') {
              const newContent = space.content.map((task: Task) => 
                  task.id === taskId ? { ...task, completed: !task.completed } : task
              );
              return { ...space, content: newContent };
          }
          return space;
      }));
  };

  const removeTaskFromSpace = (spaceId: string, taskId: string) => {
      setDashboardSpaces(prev => prev.map(space => {
          if (space.id === spaceId && space.type === 'todo') {
              const newContent = space.content.filter((task: Task) => task.id !== taskId);
              return { ...space, content: newContent };
          }
          return space;
      }));
  };

  const updateNoteInSpace = (spaceId: string, note: Note) => {
    setDashboardSpaces(prev => prev.map(space => {
        if (space.id === spaceId && space.type === 'note') {
            return { ...space, content: note };
        }
        return space;
    }));
  };
  
  const isToolInDashboard = (toolId: string): boolean => {
    return dashboardSpaces.some(space => 
        space.type === 'links' && space.content.some((link: DashboardLink) => link.id === toolId)
    );
  };

  const addToolToDashboard = (tool: FavoriteTool) => {
    setDashboardSpaces(prev => {
        const firstLinkSpace = prev.find(s => s.type === 'links');
        if (!firstLinkSpace) return prev;

        return prev.map(space => {
            if (space.id === firstLinkSpace.id) {
                if (space.content.some((l: DashboardLink) => l.id === tool.id)) return space;
                const newLink: DashboardLink = { ...tool };
                return { ...space, content: [...space.content, newLink] };
            }
            return space;
        });
    });
  };

  const removeToolFromDashboard = (toolId: string) => {
      setDashboardSpaces(prev => prev.map(space => {
          if (space.type === 'links') {
              return { ...space, content: space.content.filter((link: DashboardLink) => link.id !== toolId) };
          }
          return space;
      }));
  };


  // --- Context Value ---
  const value: AppContextType = {
    favoriteTools, conversations, starredConversations, dashboardSpaces,
    addFavoriteTool, removeFavoriteTool, isFavorite,
    createConversation, addMessageToConversation, updateConversationTitle, deleteConversation, toggleStarConversation, getConversation,
    addSpace, removeSpace, updateSpace, reorderDashboardSpaces,
    addLinkToSpace, removeLinkFromSpace, 
    addTaskToSpace, toggleTaskInSpace, removeTaskFromSpace,
    updateNoteInSpace,
    isToolInDashboard, addToolToDashboard, removeToolFromDashboard
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
