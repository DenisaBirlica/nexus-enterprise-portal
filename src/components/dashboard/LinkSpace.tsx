import React, { useState } from 'react';
import { useApp, DashboardLink } from '../../contexts/AppContext';
import { TrashIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LinkSpaceProps {
  spaceId: string;
  links: DashboardLink[];
}

const LinkSpace: React.FC<LinkSpaceProps> = ({ spaceId, links }) => {
  const { addLinkToSpace, removeLinkFromSpace } = useApp();
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newToolName && newToolUrl) {
      addLinkToSpace(spaceId, { name: newToolName, url: newToolUrl });
      setNewToolName('');
      setNewToolUrl('');
      setShowAddForm(false);
    }
  };

  const handleCancelAdd = () => {
      setShowAddForm(false);
      setNewToolName('');
      setNewToolUrl('');
  }

  const confirmDelete = (linkId: string) => {
    removeLinkFromSpace(spaceId, linkId);
    setDeletingId(null);
  };

  return (
    <div>
      {links.map(link => (
        <div 
          key={link.id}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}
        >
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'white', textDecoration: 'none', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {link.name}
          </a>
          {deletingId === link.id ? (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <button onClick={() => confirmDelete(link.id)} style={{background:'none', border:'none', color:'#34D399'}}><CheckIcon width={20}/></button>
                <button onClick={() => setDeletingId(null)} style={{background:'none', border:'none', color:'#F87171'}}><XMarkIcon width={20}/></button>
            </div>
          ) : (
            <button
                onClick={() => setDeletingId(link.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            >
                <TrashIcon style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.6)' }} />
            </button>
          )}
        </div>
      ))}

      {showAddForm ? (
         <div style={{ marginTop: '1rem' }}>
            <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Link Name"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: 'none', background: 'rgba(255, 255, 255, 0.9)' }}
              />
              <input
                type="url"
                placeholder="URL"
                value={newToolUrl}
                onChange={(e) => setNewToolUrl(e.target.value)}
                style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: 'none', background: 'rgba(255, 255, 255, 0.9)' }}
                required
              />
              <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#fbbf24', color: '#4c2b04', fontWeight: '600', cursor: 'pointer' }}>
                Add
              </button>
              <button type="button" onClick={handleCancelAdd} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}>
                Cancel
              </button>
            </form>
          </div>
      ) : (
        <button 
            onClick={() => setShowAddForm(true)}
            style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem', width: '100%', justifyContent: 'center',
                marginTop: '0.5rem', borderRadius: '6px'
            }}
        >
            <PlusIcon style={{width: '16px'}} /> Add a link
        </button>
      )}
    </div>
  );
};

export default LinkSpace;
