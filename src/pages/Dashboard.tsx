import React, { useState } from 'react';
import { useApp, Space, SpaceType } from '../contexts/AppContext';
import { PlusIcon, TrashIcon, CogIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LinkSpace from '../components/dashboard/LinkSpace';
import ITimeReminder from '../components/dashboard/ITimeReminder';
import WorldClock from '../components/dashboard/WorldClock';
import WorldClockSettings from '../components/dashboard/WorldClockSettings';
import TodoSpace from '../components/dashboard/TodoSpace';
import NoteSpace from '../components/dashboard/NoteSpace';
import NoteSettings from '../components/dashboard/NoteSettings';
import SpaceNameEditor from '../components/dashboard/SpaceNameEditor';

const Dashboard: React.FC = () => {
  const { dashboardSpaces, addSpace, removeSpace, reorderDashboardSpaces } = useApp();
  const [showAddSpace, setShowAddSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceType, setNewSpaceType] = useState<SpaceType>('links');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [draggedSpaceId, setDraggedSpaceId] = useState<string | null>(null);

  const handleAddSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpaceName) {
      addSpace(newSpaceName, newSpaceType);
      setNewSpaceName('');
      setNewSpaceType('links');
      setShowAddSpace(false);
    }
  };
  
  const renderSpaceContent = (space: Space) => {
      switch (space.type) {
          case 'links':
              return <LinkSpace spaceId={space.id} links={space.content} />;
          case 'todo':
              return <TodoSpace spaceId={space.id} tasks={space.content} />;
          case 'note':
              return <NoteSpace spaceId={space.id} initialNote={space.content} />;
          case 'itime-reminder':
              return <ITimeReminder />;
          case 'world-clock':
              return <WorldClock timezones={space.content.timezones} />;
          default:
              return <p>Unknown space type</p>;
      }
  }
  
  const confirmDelete = (spaceId: string) => {
      removeSpace(spaceId);
      setDeletingId(null);
  };

  const toggleSettings = (spaceId: string) => {
    setSettingsId(prevId => (prevId === spaceId ? null : spaceId));
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, spaceId: string) => {
    setDraggedSpaceId(spaceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetSpaceId: string) => {
    if (draggedSpaceId && draggedSpaceId !== targetSpaceId) {
        reorderDashboardSpaces(draggedSpaceId, targetSpaceId);
    }
    setDraggedSpaceId(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>
              Personal Dashboard
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Your modular, personalized workspace.
            </p>
          </div>
          <button 
            onClick={() => setShowAddSpace(!showAddSpace)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <PlusIcon style={{width: '20px'}}/>
            {showAddSpace ? 'Cancel' : 'Add Space'}
          </button>
        </div>

        {showAddSpace && (
          <div style={{ marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.1)', padding: '1.5rem', borderRadius: '16px' }}>
            <form onSubmit={handleAddSpace} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="New Space Name"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'rgba(255, 255, 255, 0.9)' }}
                required
              />
              <select 
                value={newSpaceType} 
                onChange={e => setNewSpaceType(e.target.value as SpaceType)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'rgba(255, 255, 255, 0.9)' }}
              >
                  <option value="links">Links</option>
                  <option value="todo">To-Do List</option>
                  <option value="note">Note</option>
                  <option value="itime-reminder">iTime Reminder</option>
                  <option value="world-clock">World Clock</option>
              </select>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#fbbf24', color: '#4c2b04', fontWeight: '600', cursor: 'pointer' }}>
                Add
              </button>
            </form>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {dashboardSpaces.map(space => {
            const isSettingsAvailable = space.type === 'world-clock' || space.type === 'note' || space.type === 'links' || space.type === 'todo' || space.type === 'itime-reminder';
            const isBeingDragged = draggedSpaceId === space.id;

            return (
                <div 
                    key={space.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, space.id)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isBeingDragged ? 'rgba(251, 191, 36, 0.7)' : 'rgba(255, 255, 255, 0.2)'}`,
                        borderRadius: '12px',
                        color: 'white',
                        opacity: isBeingDragged ? 0.5 : 1,
                        transition: 'opacity 0.2s ease-in-out, border-color 0.2s ease-in-out',
                    }}
                >
                    <div 
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, space.id)}
                        onDragEnd={() => setDraggedSpaceId(null)}
                        style={{
                            padding: '1rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'grab',
                        }}
                    >
                        <h3 style={{ margin: 0, fontWeight: 600 }}>{space.name}</h3>
                        <div>
                            {deletingId === space.id ? (
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <button onClick={() => confirmDelete(space.id)} style={{background:'none', border:'none', color:'#34D399'}}><CheckIcon width={20}/></button>
                                    <button onClick={() => setDeletingId(null)} style={{background:'none', border:'none', color:'#F87171'}}><XMarkIcon width={20}/></button>
                                </div>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => isSettingsAvailable && toggleSettings(space.id)}
                                        style={{background:'none', border: 'none', color: isSettingsAvailable ? 'white' : 'rgba(255,255,255,0.3)', padding:'0.25rem', cursor: isSettingsAvailable ? 'pointer' : 'default'}}
                                        title={isSettingsAvailable ? "Settings" : "No settings available"}
                                    >
                                        <CogIcon width={16}/>
                                    </button>
                                    <button onClick={() => setDeletingId(space.id)} style={{background:'none', border: 'none', color:'white', padding:'0.25rem'}}><TrashIcon width={16}/></button>
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{padding: '1rem'}}>
                        {renderSpaceContent(space)}
                        {settingsId === space.id && (
                            <div style={{borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: '1rem', paddingTop: '1rem'}}>
                                <SpaceNameEditor space={space} />
                                {space.type === 'world-clock' && (
                                    <WorldClockSettings space={space} onClose={() => setSettingsId(null)} />
                                )}
                                {space.type === 'note' && (
                                    <NoteSettings spaceId={space.id} currentNote={space.content} onClose={() => setSettingsId(null)} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )})
        }
        </div>
        
        {dashboardSpaces.length === 0 && !showAddSpace && (
            <div style={{textAlign: 'center', padding: '3rem', color: 'rgba(255, 255, 255, 0.8)'}}>
                <p>Your dashboard is empty.</p>
                <p>Click "Add Space" to create your first widget.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
