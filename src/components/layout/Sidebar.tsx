import React, { useState } from 'react';
import { 
  HomeIcon, 
  CogIcon, 
  XMarkIcon,
  MapPinIcon,
  PlusIcon,
  ClockIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  CheckIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { generateUUID } from '../../utils/uuid';

interface SidebarProps {
  isOpen: boolean;
  isPinned: boolean;
  onClose: () => void;
  onTogglePin: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isPinned, onClose, onTogglePin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    favoriteTools, 
    conversations,
    starredConversations,
    createConversation,
    deleteConversation, 
    toggleStarConversation, 
    updateConversationTitle 
  } = useApp();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [renamingConversation, setRenamingConversation] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const unstarredConversations = conversations.filter(conv => !conv.starred);

  const mainNavItems: SidebarItem[] = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'tools', label: 'Tools', icon: CogIcon, path: '/tools' },
    { id: 'dashboard', label: 'Dashboard', icon: RectangleGroupIcon, path: '/dashboard' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (!isPinned) onClose();
  };

  const handleConversationClick = (conversation: any) => {
    navigate(`/chat/${conversation.id}`);
    if (!isPinned) onClose();
  };

  const handleDropdownClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDropdown(activeDropdown === conversationId ? null : conversationId);
  };

  const handleRename = (conversationId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRenamingConversation(conversationId);
    setRenameValue(currentTitle);
    setActiveDropdown(null);
    setConfirmingDelete(null);
  };

  const submitRename = (conversationId: string) => {
    if (renameValue.trim()) {
      updateConversationTitle(conversationId, renameValue);
    }
    setRenamingConversation(null);
    setRenameValue('');
  };

  const handleDelete = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteConversation(conversationId);
    setActiveDropdown(null);
    setConfirmingDelete(null);
  };

  const handleStar = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleStarConversation(conversationId);
    setActiveDropdown(null);
    setConfirmingDelete(null);
  };

  const startDelete = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setConfirmingDelete(conversationId);
    setActiveDropdown(null);
    setRenamingConversation(null);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setConfirmingDelete(null);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-item-container')) {
        setActiveDropdown(null);
        setConfirmingDelete(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const renderConversationItem = (conversation: any) => (
    <div key={conversation.id} className="search-item-container">
      {renamingConversation === conversation.id ? (
        <div className="rename-input-container">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitRename(conversation.id);
              if (e.key === 'Escape') setRenamingConversation(null);
            }}
            onBlur={() => submitRename(conversation.id)}
            className="rename-input"
            autoFocus
          />
        </div>
      ) : confirmingDelete === conversation.id ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 0.75rem'
        }}>
          <span style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            flex: 1
          }}>
            Delete?
          </span>
          <button
            onClick={(e) => handleDelete(conversation.id, e)}
            style={{ 
              padding: '0.25rem', 
              background: 'transparent', 
              border: 'none', 
              color: '#6b7280', 
              cursor: 'pointer',
              borderRadius: '4px'
            }}
            title="Confirm delete"
          >
            <CheckIcon className="icon-sm" />
          </button>
          <button
            onClick={cancelDelete}
            style={{ 
              padding: '0.25rem', 
              background: 'transparent', 
              border: 'none', 
              color: '#6b7280', 
              cursor: 'pointer',
              borderRadius: '4px'
            }}
            title="Cancel"
          >
            <XMarkIcon className="icon-sm" />
          </button>
        </div>
      ) : (
        <>
          <button
            className="sidebar-list-item search-item"
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="search-item-icon">
              {conversation.starred ? (
                <StarIconSolid className="icon-sm star-filled" />
              ) : (
                <ClockIcon className="icon-sm" />
              )}
            </div>
            <span className="sidebar-list-text">
              {conversation.title}
            </span>
          </button>
          
          <div className="search-item-menu">
            <button
              className="menu-trigger"
              onClick={(e) => handleDropdownClick(conversation.id, e)}
            >
              <EllipsisHorizontalIcon className="icon-sm" />
            </button>
            
            {activeDropdown === conversation.id && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={(e) => handleStar(conversation.id, e)}
                >
                  {conversation.starred ? (
                    <>
                      <StarIcon className="icon-sm" />
                      <span>Unstar</span>
                    </>
                  ) : (
                    <>
                      <StarIconSolid className="icon-sm" />
                      <span>Star</span>
                    </>
                  )}
                </button>
                <button
                  className="dropdown-item"
                  onClick={(e) => handleRename(conversation.id, conversation.title, e)}
                >
                  <PencilIcon className="icon-sm" />
                  <span>Rename</span>
                </button>
                <button
                  className="dropdown-item delete"
                  onClick={(e) => startDelete(conversation.id, e)}
                >
                  <TrashIcon className="icon-sm" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {!isPinned && <div className="sidebar-overlay" onClick={onClose} />}
      
      <div className={`sidebar ${isPinned ? 'sidebar-pinned' : 'sidebar-floating'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">N</div>
            <span className="sidebar-logo-text">nexus</span>
          </div>
          <div className="sidebar-controls">
            <button
              onClick={onTogglePin}
              className={`sidebar-control-btn ${isPinned ? 'active' : ''}`}
              title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              <MapPinIcon className="icon-sm" />
            </button>
            {!isPinned && (
              <button onClick={onClose} className="sidebar-control-btn" title="Close sidebar">
                <XMarkIcon className="icon-sm" />
              </button>
            )}
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <button onClick={() => handleNavigation('/')} className="new-search-btn">
              <PlusIcon className="icon-sm" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-nav">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {starredConversations.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-section-header">
                <h3 className="sidebar-section-title">Starred</h3>
                <button 
                  className="see-all-btn"
                  onClick={() => handleNavigation('/chat-history')}
                  title="See all conversations"
                >
                  <span className="see-all-text">See all</span>
                  <ChevronRightIcon className="icon-sm" />
                </button>
              </div>
              <div className="sidebar-list">
                {starredConversations.slice(0, 3).map(renderConversationItem)}
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3 className="sidebar-section-title">Recent Chats</h3>
              <button 
                className="see-all-btn"
                onClick={() => handleNavigation('/chat-history')}
                title="See all conversations"
              >
                <span className="see-all-text">See all</span>
                <ChevronRightIcon className="icon-sm" />
              </button>
            </div>
            {unstarredConversations.length > 0 ? (
              <div className="sidebar-list">
                {unstarredConversations.slice(0, 3).map(renderConversationItem)}
              </div>
            ) : (
              <div className="sidebar-empty-state">
                <p className="sidebar-empty-text">No conversations yet</p>
                <p className="sidebar-empty-subtext">Start a new chat to begin</p>
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3 className="sidebar-section-title">Favorite Tools</h3>
              <button 
                className="sidebar-add-btn"
                onClick={() => handleNavigation('/tools')}
                title="Browse tools"
              >
                <PlusIcon className="icon-sm" />
              </button>
            </div>
            {favoriteTools.length > 0 ? (
              <div className="sidebar-list">
                {favoriteTools.slice(0, 6).map((tool) => (
                  <button
                    key={tool.id}
                    className="sidebar-list-item"
                    onClick={() => window.open(tool.url, '_blank')}
                  >
                    <BookmarkIcon className="icon-sm" />
                    <span className="sidebar-list-text">{tool.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="sidebar-empty-state">
                <p className="sidebar-empty-text">No favorite tools yet</p>
                <p className="sidebar-empty-subtext">Add favorites from the Tools page</p>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div className="user-details">
              <p className="user-name">John Doe</p>
              <p className="user-email">john.doe@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;