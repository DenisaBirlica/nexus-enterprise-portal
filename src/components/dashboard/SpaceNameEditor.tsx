import React, { useState, useEffect } from 'react';
import { useApp, Space } from '../../contexts/AppContext';

interface SpaceNameEditorProps {
  space: Space;
}

const SpaceNameEditor: React.FC<SpaceNameEditorProps> = ({ space }) => {
  const { updateSpace } = useApp();
  const [name, setName] = useState(space.name);

  useEffect(() => {
    const handler = setTimeout(() => {
        if (name.trim() && name !== space.name) {
            updateSpace({ ...space, name: name.trim() });
        }
    }, 500); // Debounce saving

    return () => {
      clearTimeout(handler);
    };
  }, [name, space, updateSpace]);

  useEffect(() => {
      setName(space.name);
  }, [space.name]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4 style={{ marginTop: 0, marginBottom: '0.75rem', fontWeight: 500 }}>Space Name</h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
      />
    </div>
  );
};

export default SpaceNameEditor;
