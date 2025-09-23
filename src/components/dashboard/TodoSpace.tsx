import React, { useState } from 'react';
import { useApp, Task } from '../../contexts/AppContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TodoSpaceProps {
  spaceId: string;
  tasks: Task[];
}

const TodoSpace: React.FC<TodoSpaceProps> = ({ spaceId, tasks }) => {
  const { addTaskToSpace, toggleTaskInSpace, removeTaskFromSpace } = useApp();
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTaskToSpace(spaceId, newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.3rem 0' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskInSpace(spaceId, task.id)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1, transition: 'all 0.2s' }}>
              {task.text}
            </span>
            <button
              onClick={() => removeTaskFromSpace(spaceId, task.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            >
              <TrashIcon style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.5)' }} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
            <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', margin: '1rem 0'}}>No tasks yet. Add one below!</p>
        )}
      </div>

      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="New task..."
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#fbbf24', color: '#4c2b04', fontWeight: '600', cursor: 'pointer' }}>
          Add
        </button>
      </form>
    </div>
  );
};

export default TodoSpace;
