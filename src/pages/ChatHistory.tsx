import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useApp } from '../contexts/AppContext';

const ChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const { 
    conversations,
    starredConversations,
    deleteConversation,
    toggleStarConversation,
    updateConversationTitle
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showStarred, setShowStarred] = useState(false);
  
  // Confirmation states
  const [confirmingDeleteSelected, setConfirmingDeleteSelected] = useState(false);
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);
  const [confirmingDeleteSingle, setConfirmingDeleteSingle] = useState<string | null>(null);

  const allConversations = showStarred ? starredConversations : conversations;
  const filteredConversations = allConversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedItems.size === filteredConversations.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredConversations.map(c => c.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => deleteConversation(id));
    setSelectedItems(new Set());
    setConfirmingDeleteSelected(false);
  };

  const handleClearAll = () => {
    conversations.forEach(conv => deleteConversation(conv.id));
    setSelectedItems(new Set());
    setConfirmingClearAll(false);
  };

  const handleDeleteSingle = (conversationId: string) => {
    deleteConversation(conversationId);
    setConfirmingDeleteSingle(null);
  };

  const handleEdit = (conversation: any) => {
    setEditingId(conversation.id);
    setEditValue(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      updateConversationTitle(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleNavigateToConversation = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>
            Your Chat History
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
            Manage your conversations and find chats quickly
          </p>
        </div>

        {/* Controls */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '16px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          
          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ 
              flex: 1,
              minWidth: '300px',
              background: 'white', 
              borderRadius: '12px', 
              padding: '0.75rem 1rem', 
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <MagnifyingGlassIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search your conversations..."
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
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowStarred(false)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: !showStarred ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                All ({conversations.length})
              </button>
              <button
                onClick={() => setShowStarred(true)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: showStarred ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Starred ({starredConversations.length})
              </button>
            </div>
          </div>

          {/* Selection Controls */}
          {filteredConversations.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredConversations.length && filteredConversations.length > 0}
                  onChange={handleSelectAll}
                  style={{ marginRight: '0.25rem' }}
                />
                Select all
              </label>
              
              {selectedItems.size > 0 && (
                <>
                  <span>({selectedItems.size} selected)</span>
                  
                  {/* Delete Selected with Confirmation */}
                  {confirmingDeleteSelected ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        background: 'rgba(220, 38, 38, 0.9)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}>
                        <ExclamationTriangleIcon style={{ width: '16px', height: '16px' }} />
                        <span>Delete {selectedItems.size} items?</span>
                      </div>
                      <button
                        onClick={handleDeleteSelected}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(220, 38, 38, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        title="Confirm delete"
                      >
                        <CheckIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteSelected(false)}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(107, 114, 128, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        title="Cancel"
                      >
                        <XMarkIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingDeleteSelected(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(220, 38, 38, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      <TrashIcon style={{ width: '16px', height: '16px' }} />
                      Delete selected
                    </button>
                  )}
                </>
              )}
              
              {/* Clear All with Confirmation */}
              {!showStarred && (
                <>
                  {confirmingClearAll ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        background: 'rgba(220, 38, 38, 0.9)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}>
                        <ExclamationTriangleIcon style={{ width: '16px', height: '16px' }} />
                        <span>Clear all history?</span>
                      </div>
                      <button
                        onClick={handleClearAll}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(220, 38, 38, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        title="Confirm clear all"
                      >
                        <CheckIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button
                        onClick={() => setConfirmingClearAll(false)}
                        style={{
                          padding: '0.5rem',
                          background: 'rgba(107, 114, 128, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        title="Cancel"
                      >
                        <XMarkIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingClearAll(true)}
                      style={{
                        marginLeft: 'auto',
                        padding: '0.5rem 1rem',
                        background: 'rgba(220, 38, 38, 0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Clear all
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Conversations Results */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '16px', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden'
        }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
              {allConversations.length === 0 ? (
                <p>No {showStarred ? 'starred' : ''} conversations yet</p>
              ) : (
                <p>No conversations match your filter</p>
              )}
            </div>
          ) : (
            <div>
              {filteredConversations.map((conversation, index) => (
                <div 
                  key={conversation.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    borderBottom: index < filteredConversations.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    color: 'white',
                    transition: 'background-color 0.2s ease',
                    cursor: editingId === conversation.id ? 'default' : 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    if (editingId !== conversation.id && selectedItems.size === 0) {
                      handleNavigateToConversation(conversation.id);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(conversation.id)}
                    onChange={() => handleSelectItem(conversation.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginRight: '1rem' }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    {editingId === conversation.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            outline: 'none'
                          }}
                          autoFocus
                        />
                        <button 
                          onClick={handleSaveEdit} 
                          style={{ 
                            padding: '0.25rem', 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'white', 
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          title="Save"
                        >
                          <CheckIcon style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button 
                          onClick={handleCancelEdit} 
                          style={{ 
                            padding: '0.25rem', 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'white', 
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          title="Cancel"
                        >
                          <XMarkIcon style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          {conversation.title}
                        </div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                          {formatDate(conversation.lastUpdated)} • {conversation.messages.length} messages
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarConversation(conversation.id);
                      }}
                      style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: conversation.starred ? '#fbbf24' : 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {conversation.starred ? (
                        <StarIconSolid style={{ width: '18px', height: '18px' }} />
                      ) : (
                        <StarIcon style={{ width: '18px', height: '18px' }} />
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(conversation);
                      }}
                      style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <PencilIcon style={{ width: '18px', height: '18px' }} />
                    </button>
                    
                    {/* Single Delete with Confirmation */}
                    {confirmingDeleteSingle === conversation.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSingle(conversation.id);
                          }}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(220, 38, 38, 0.8)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          title="Confirm delete"
                        >
                          <CheckIcon style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmingDeleteSingle(null);
                          }}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(107, 114, 128, 0.8)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          title="Cancel"
                        >
                          <XMarkIcon style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingDeleteSingle(conversation.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(220, 38, 38, 0.8)',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <TrashIcon style={{ width: '18px', height: '18px' }} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;