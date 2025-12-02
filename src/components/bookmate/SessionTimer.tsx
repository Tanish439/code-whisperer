import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface SessionTimerProps {
  startTime: number;
  status: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ startTime, status }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === 'active') {
      const interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsed(Math.floor((Date.now() - startTime) / 1000)); 
    }
  }, [startTime, status]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="font-mono tabular-nums text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md flex items-center gap-1.5">
      <Clock size={12} className={status === 'active' ? 'text-blue-500 animate-pulse' : 'text-gray-400'} />
      {formatTime(elapsed)}
    </div>
  );
};
