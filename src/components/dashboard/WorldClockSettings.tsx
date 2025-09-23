import React, { useState } from 'react';
import { useApp, Space } from '../../contexts/AppContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WorldClockSettingsProps {
  space: Space;
  onClose: () => void;
}

// A basic list of IANA timezones. In a real app, you'd want a more comprehensive searchable list.
const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai', 'Asia/Kolkata',
    'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland'
].sort();

const WorldClockSettings: React.FC<WorldClockSettingsProps> = ({ space, onClose }) => {
  const { updateSpace } = useApp();
  const [newTimezone, setNewTimezone] = useState('');

  const addTimezone = () => {
    if (newTimezone && !space.content.timezones.includes(newTimezone)) {
      const updatedTimezones = [...space.content.timezones, newTimezone];
      updateSpace({ ...space, content: { timezones: updatedTimezones } });
      setNewTimezone('');
    }
  };

  const removeTimezone = (tzToRemove: string) => {
    const updatedTimezones = space.content.timezones.filter((tz: string) => tz !== tzToRemove);
    updateSpace({ ...space, content: { timezones: updatedTimezones } });
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      <p style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Manage Timezones</p>
      
      <div style={{ marginBottom: '1rem' }}>
        {space.content.timezones.map((tz: string) => (
          <div key={tz} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
            <span>{tz.split('/').pop()?.replace('_',' ')}</span>
            <button onClick={() => removeTimezone(tz)} style={{background:'none', border:'none', color:'rgba(255,255,255,0.6)'}}><XMarkIcon width={16} /></button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          list="timezones-list"
          placeholder="Add timezone..."
          value={newTimezone}
          onChange={(e) => setNewTimezone(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: 'none', background: 'rgba(255, 255, 255, 0.9)' }}
        />
        <datalist id="timezones-list">
            {timezones.map(tz => <option key={tz} value={tz} />)}
        </datalist>

        <button onClick={addTimezone} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#fbbf24', color: '#4c2b04', fontWeight: '600', cursor: 'pointer' }}>Add</button>
      </div>
    </div>
  );
};

export default WorldClockSettings;
