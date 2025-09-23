import React from 'react';
import { useApp, Note } from '../../contexts/AppContext';

interface NoteSettingsProps {
  spaceId: string;
  currentNote: Note;
  onClose: () => void;
}

const NoteSettings: React.FC<NoteSettingsProps> = ({ spaceId, currentNote, onClose }) => {
  const { updateNoteInSpace } = useApp();

  const colors = [
    { name: 'Default', value: 'rgba(0,0,0,0.2)' },
    { name: 'Amber', value: 'rgba(251, 146, 60, 0.2)' },
  ];

  const handleColorChange = (color: string) => {
    updateNoteInSpace(spaceId, { ...currentNote, color });
    onClose();
  };

  return (
    <div>
      <h4 style={{ marginTop: 0, marginBottom: '0.75rem', fontWeight: 500 }}>Note Color</h4>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {colors.map(c => (
          <button
            key={c.name}
            onClick={() => handleColorChange(c.value)}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: c.value,
              border: currentNote.color === c.value ? '2px solid white' : '2px solid transparent',
              cursor: 'pointer'
            }}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteSettings;
