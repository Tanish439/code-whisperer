import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToggleProps {
  active: boolean;
  onToggle: () => void;
  icon?: LucideIcon;
}

export const Toggle: React.FC<ToggleProps> = ({ active, onToggle, icon: Icon }) => (
  <button 
    onClick={onToggle}
    className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${active ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`}
  >
    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${active ? 'translate-x-6' : 'translate-x-0'}`}>
      {Icon && <Icon size={12} className={active ? 'text-blue-600' : 'text-gray-400'} />}
    </div>
  </button>
);
