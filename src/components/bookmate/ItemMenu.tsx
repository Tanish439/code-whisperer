import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface ItemMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDelete: () => void;
  onRename: () => void;
  onColorChange: (color: string) => void;
  currentColor: string;
}

export const ItemMenu: React.FC<ItemMenuProps> = ({ 
  isOpen, 
  onClose, 
  onRequestDelete, 
  onRename, 
  onColorChange, 
  currentColor 
}) => {
  if (!isOpen) return null;
  
  const colors = [
    { id: 'blue', bg: 'bg-blue-500' },
    { id: 'red', bg: 'bg-red-500' },
    { id: 'green', bg: 'bg-emerald-500' },
    { id: 'purple', bg: 'bg-purple-500' },
    { id: 'orange', bg: 'bg-orange-500' },
    { id: 'gray', bg: 'bg-gray-500' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onClose(); }}></div>
      <div 
        className="absolute top-10 right-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 p-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Color Tag</div>
        <div className="flex gap-2 px-3 pb-2 flex-wrap">
          {colors.map(c => (
            <button
              key={c.id}
              onClick={(e) => { e.stopPropagation(); onColorChange(c.id); }}
              className={`w-6 h-6 rounded-full ${c.bg} hover:scale-110 transition-transform ${currentColor === c.id ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''}`}
            />
          ))}
        </div>
        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
        <button 
          onClick={(e) => { e.stopPropagation(); onRename(); }} 
          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
        >
          <Edit2 size={14} /> Rename
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onRequestDelete(); }} 
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </>
  );
};
