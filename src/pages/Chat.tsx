import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SearchInterface from '../components/search/SearchInterface';
import SearchResults from '../components/search/SearchResults';
import { useSearch } from '../contexts/SearchContext';
import { useApp } from '../contexts/AppContext';

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { performSearch, isLoading } = useSearch();
  const { getConversation, addMessageToConversation } = useApp();
  const [conversation, setConversation] = useState<any>(null);
  const isProcessingRef = useRef(false);
  const initialQueryProcessedRef = useRef(false);

  useEffect(() => {
    if (!chatId) return;

    const conv = getConversation(chatId);
    setConversation(conv);

    const state = location.state as { initialQuery?: string } | null;
    if (state?.initialQuery && conv && conv.messages.length === 0 && !initialQueryProcessedRef.current) {
      initialQueryProcessedRef.current = true;
      setTimeout(() => {
        handleNewMessage(state.initialQuery!);
      }, 100);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [chatId, location.state]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (chatId && !isProcessingRef.current) {
        const conv = getConversation(chatId);
        if (conv && JSON.stringify(conv) !== JSON.stringify(conversation)) {
          setConversation(conv);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [chatId, conversation, getConversation]);

  const handleNewMessage = async (userMessage: string) => {
    if (!chatId || isProcessingRef.current) return;
    
    isProcessingRef.current = true;

    try {
      addMessageToConversation(chatId, {
        type: 'user',
        content: userMessage
      });

      const updatedConv = getConversation(chatId);
      setConversation(updatedConv);

      const results = await performSearch(userMessage);
      
      addMessageToConversation(chatId, {
        type: 'assistant',
        content: `Found ${results.length} results for "${userMessage}"`,
        searchResults: results
      });

      const finalConv = getConversation(chatId);
      setConversation(finalConv);
      
    } catch (error) {
      console.error('Error in handleNewMessage:', error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  if (!chatId) {
    navigate('/');
    return null;
  }

  if (!conversation) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        Loading conversation...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: 'white', 
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            {conversation.title}
          </h1>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          {conversation.messages.map((message: any) => (
            <div key={message.id} style={{ marginBottom: '2rem' }}>
              {message.type === 'user' ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    JD
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '1rem 1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    flex: 1
                  }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '1rem',
                      color: '#1f2937',
                      lineHeight: '1.6'
                    }}>
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    N
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    flex: 1
                  }}>
                    <SearchResults 
                      results={message.searchResults} 
                      query={message.content.match(/Found \d+ results for "(.+)"/)?.[1] || ''}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                N
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                flex: 1
              }}>
                <SearchResults isLoading={true} />
              </div>
            </div>
          )}
        </div>

        <div style={{
          position: 'sticky',
          bottom: '2rem',
          marginLeft: 'calc(32px + 1rem)'
        }}>
          <SearchInterface onSearch={handleNewMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;