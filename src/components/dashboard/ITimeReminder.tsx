import React from 'react';

const ITimeReminder: React.FC = () => {

  const isTimeSubmitted = false; // Mock data

  return (
    <div style={{
        background: isTimeSubmitted ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 146, 60, 0.2)',
        borderRadius: '8px',
        padding: '1rem',
        color: 'white',
        textAlign: 'center'
    }}>
        <h4 style={{margin: 0, fontWeight: 600, fontSize: '1.1rem'}}>
            {isTimeSubmitted ? "iTime Submitted!" : "iTime Pending"}
        </h4>
        <p style={{margin: '0.25rem 0 0', fontSize: '0.875rem', opacity: 0.9}}>
            {isTimeSubmitted ? "Thank you for submitting your iTime." : "Don't forget to submit for last week."}
        </p>
    </div>
  );
};

export default ITimeReminder;