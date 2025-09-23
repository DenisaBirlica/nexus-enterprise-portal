import React, { useState, useEffect } from 'react';

interface WorldClockProps {
  timezones: string[];
}

const WorldClock: React.FC<WorldClockProps> = ({ timezones }) => {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes: Record<string, string> = {};
      timezones.forEach(tz => {
        const time = new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
        newTimes[tz] = time;
      });
      setTimes(newTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [timezones]);

  return (
    <div>
      {timezones.map(tz => (
        <div key={tz} style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0.75rem 0', 
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <span>{tz.split('/').pop()?.replace('_', ' ')}</span>
            <span style={{fontWeight: 600, fontSize: '1.1rem'}}>{times[tz]}</span>
        </div>
      ))}
    </div>
  );
};

export default WorldClock;