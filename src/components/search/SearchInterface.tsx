import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  MicrophoneIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSearch } from '../../contexts/SearchContext';

interface SearchInterfaceProps {
  onSearch?: (query: string) => void;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { performSearch, isLoading } = useSearch();

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      let cleanedTranscript = transcript
        .replace(/^I\.\s*/i, '')
        .replace(/^I\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      setQuery(cleanedTranscript);
    }
  }, [transcript]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (isRecording) {
        stopListening();
      }
      
      if (onSearch) {
        onSearch(query);
      } else {
        await performSearch(query);
      }
      
      setQuery(''); // Clear input after search
    }
  };

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      setQuery('');
      SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US'
      });
      setIsRecording(true);
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-interface">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-container">
          <div className="search-input-wrapper">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your company resources..."
              className="search-textarea"
              rows={1}
              disabled={isLoading}
              style={{ resize: 'none', overflow: 'hidden' }}
            />
          </div>

          <div className="search-controls">
            <div className="search-actions">
              {browserSupportsSpeechRecognition && (
                <button
                  type="button"
                  onClick={isRecording ? stopListening : startListening}
                  className={`action-button ${isRecording ? 'recording' : ''}`}
                  title={isRecording ? 'Stop recording' : 'Start voice search'}
                >
                  {isRecording ? (
                    <SpeakerWaveIcon className="icon" />
                  ) : (
                    <MicrophoneIcon className="icon" />
                  )}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="search-button"
            >
              <MagnifyingGlassIcon className="icon" />
            </button>
          </div>

          {isRecording && (
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span>Listening...</span>
            </div>
          )}
        </div>
      </form>

      {!browserSupportsSpeechRecognition && (
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
          Speech recognition not supported. Try Chrome or Edge.
        </p>
      )}
    </div>
  );
};

export default SearchInterface;