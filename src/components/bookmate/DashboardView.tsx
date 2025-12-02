import React, { useState } from 'react';
import { 
  Settings, 
  BookOpen, 
  Home, 
  ChevronRight, 
  Folder, 
  FolderPlus, 
  FileText, 
  MoreVertical,
  Clock
} from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { DeleteModal } from './DeleteModal';
import { ItemMenu } from './ItemMenu';

interface Item {
  id: string;
  title: string;
  type: 'folder' | 'session';
  parentId: string | null;
  color: string;
  createdAt: number;
  status: string;
  questions: number[];
  lastAccessed: number;
}

interface DashboardViewProps {
  items: Item[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  onOpenSettings: () => void;
  onCreateItem: (name: string, type: string, parentId: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<Item>) => void;
  onDeleteItem: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  items, 
  currentFolderId,
  setCurrentFolderId,
  onOpenSettings,
  onCreateItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [createType, setCreateType] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Get current folder path
  const getPath = (folderId: string | null) => {
    const path: Item[] = [];
    let current = items.find(i => i.id === folderId);
    while (current) {
      path.unshift(current);
      current = items.find(i => i.id === current!.parentId);
    }
    return path;
  };

  const currentPath = getPath(currentFolderId);
  const currentItems = items.filter(i => i.parentId === currentFolderId);
  const folders = currentItems.filter(i => i.type === 'folder');
  const sessions = currentItems.filter(i => i.type === 'session');

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return map[color] || map.blue;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onCreateItem(newItemName, createType!, currentFolderId);
    setNewItemName('');
    setCreateType(null);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 min-h-screen flex flex-col bg-gray-50 dark:bg-black transition-colors duration-300">
      
      {/* Creation Modal */}
      {createType && (
        <Modal isOpen={true} onClose={() => setCreateType(null)} title={`New ${createType === 'folder' ? 'Folder' : 'Session'}`}>
          <form onSubmit={handleCreate}>
            <input 
              autoFocus
              type="text" 
              placeholder={`Enter ${createType} name...`}
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white mb-4"
            />
            <Button type="submit" className="w-full" disabled={!newItemName.trim()}>Create</Button>
          </form>
        </Modal>
      )}

      {/* Rename Modal */}
      {renameId && (
        <Modal isOpen={true} onClose={() => setRenameId(null)} title="Rename Item">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (newItemName.trim()) onUpdateItem(renameId, { title: newItemName });
            setRenameId(null);
            setNewItemName('');
          }}>
            <input 
              autoFocus
              type="text" 
              placeholder="Enter new name..."
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white mb-4"
            />
            <Button type="submit" className="w-full" disabled={!newItemName.trim()}>Save</Button>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      <DeleteModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={() => { onDeleteItem(deleteId!); setDeleteId(null); }} 
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="group cursor-pointer select-none" onClick={() => setCurrentFolderId(null)}>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg shadow-lg">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            BookMate
          </h1>
        </div>
        <Button variant="secondary" size="icon" onClick={onOpenSettings} className="rounded-full w-10 h-10">
          <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-2 text-sm no-scrollbar">
        <button 
          onClick={() => setCurrentFolderId(null)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${!currentFolderId ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        >
          <Home size={14} /> Home
        </button>
        {currentPath.map((folder, idx) => (
          <React.Fragment key={folder.id}>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <button 
              onClick={() => setCurrentFolderId(folder.id)}
              className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors ${idx === currentPath.length - 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            >
              {folder.title}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Content Grid */}
      <div className="space-y-6 pb-24">
        
        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="text-center py-20 opacity-40 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <FolderPlus className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
            <p className="dark:text-gray-500 font-medium">Empty Folder</p>
          </div>
        )}

        {/* Folders List */}
        {folders.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {folders.map(folder => (
              <div 
                key={folder.id}
                onClick={() => setCurrentFolderId(folder.id)}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-95 transition-all cursor-pointer relative group"
              >
                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${getColorClass(folder.color)}`}>
                  <Folder size={20} fill="currentColor" className="opacity-80" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white truncate pr-6">{folder.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{items.filter(i => i.parentId === folder.id).length} items</p>

                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === folder.id ? null : folder.id); }}
                  className="absolute top-3 right-3 p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <MoreVertical size={16} />
                </button>

                <ItemMenu 
                  isOpen={menuOpenId === folder.id} 
                  onClose={() => setMenuOpenId(null)}
                  onRequestDelete={() => { setDeleteId(folder.id); setMenuOpenId(null); }}
                  onRename={() => { setRenameId(folder.id); setNewItemName(folder.title); setMenuOpenId(null); }}
                  onColorChange={(color) => { onUpdateItem(folder.id, { color }); setMenuOpenId(null); }}
                  currentColor={folder.color}
                />
              </div>
            ))}
          </div>
        )}

        {/* Sessions List */}
        {sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => onCreateItem('', 'open_session', session.id)} 
                className="group bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer relative"
              >
                <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${getColorClass(session.color).split(' ')[0].replace('bg-', 'bg-').replace('/30', '')}`}></div>
                
                <div className="pl-3 pr-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white truncate">{session.title}</h3>
                    {session.status === 'graded' && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">GRADED</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><BookOpen size={12}/> {session.questions.length} Qs</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(session.lastAccessed).toLocaleDateString()}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === session.id ? null : session.id); }}
                  className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <MoreVertical size={16} />
                </button>

                <ItemMenu 
                  isOpen={menuOpenId === session.id} 
                  onClose={() => setMenuOpenId(null)}
                  onRequestDelete={() => { setDeleteId(session.id); setMenuOpenId(null); }}
                  onRename={() => { setRenameId(session.id); setNewItemName(session.title); setMenuOpenId(null); }}
                  onColorChange={(color) => { onUpdateItem(session.id, { color }); setMenuOpenId(null); }}
                  currentColor={session.color}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <button 
          onClick={() => setCreateType('session')}
          className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 font-bold"
        >
          <FileText size={20} /> <span className="hidden sm:inline">New Session</span>
        </button>
        <button 
          onClick={() => setCreateType('folder')}
          className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all"
        >
          <FolderPlus size={20} />
        </button>
      </div>
    </div>
  );
};
