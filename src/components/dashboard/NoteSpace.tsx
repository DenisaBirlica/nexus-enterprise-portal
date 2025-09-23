import React, { useState, useEffect } from 'react';
import { useApp, Note } from '../../contexts/AppContext';

interface NoteSpaceProps {
  spaceId: string;
  initialNote: Note;
}

const NoteSpace: React.FC<NoteSpaceProps> = ({ spaceId, initialNote }) => {
  const { updateNoteInSpace } = useApp();
  const [text, setText] = useState(initialNote.text);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (text !== initialNote.text) {
        updateNoteInSpace(spaceId, { ...initialNote, text });
      }
    }, 500); // Debounce saving

    return () => {
      clearTimeout(handler);
    };
  }, [text, spaceId, initialNote, updateNoteInSpace]);

  useEffect(() => {
    setText(initialNote.text);
  }, [initialNote]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Type your notes here..."
      spellCheck={false}
      style={{
        width: '100%',
        minHeight: '120px',
        background: initialNote.color || 'rgba(0,0,0,0.2)',
        border: 'none',
        borderRadius: '8px',
        padding: '1rem',
        color: 'white',
        resize: 'vertical',
        fontFamily: 'inherit',
        fontSize: '0.9rem'
      }}
    />
  );
};

export default NoteSpace;
