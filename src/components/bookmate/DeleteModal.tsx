import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-4">
            <Trash2 size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">Delete Item?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This action cannot be undone. All folders and sessions inside will also be permanently deleted.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
