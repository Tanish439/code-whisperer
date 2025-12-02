import React, { useState, useEffect } from 'react';
import { DashboardView } from './DashboardView';
import { SettingsView } from './SettingsView';
import { SessionView } from './SessionView';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  labelType: 'ABCD' | '1234';
  defaultPositive: number;
  defaultNegative: number;
  autoAdvance: boolean;
}

interface Item {
  id: string;
  title: string;
  type: 'folder' | 'session';
  parentId: string | null;
  color: string;
  createdAt: number;
  status: string;
  questions: number[];
  answers: Record<number, number>;
  results: Record<number, 'correct' | 'wrong'>;
  bookmarks: number[];
  notes: Record<number, string>;
  positiveMark: number;
  negativeMark: number;
  sessionAutoAdvance: boolean;
  lastAccessed: number;
  endTime?: number;
}

export default function BookMate() {
  const [items, setItems] = useState<Item[]>([]);
  const [settings, setSettings] = useState<Settings>({ 
    theme: 'system', 
    labelType: 'ABCD', 
    defaultPositive: 4, 
    defaultNegative: 1, 
    autoAdvance: true 
  });
  const [view, setView] = useState<'dashboard' | 'settings' | 'session'>('dashboard');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Theme Application Logic
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    };
    applyTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme]);

  // Initial Load
  useEffect(() => {
    const savedItems = localStorage.getItem('bookmate_desktop_items');
    const savedSettings = localStorage.getItem('bookmate_desktop_settings');
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else document.documentElement.classList.add('dark');
  }, []);

  // Persistence
  useEffect(() => { 
    localStorage.setItem('bookmate_desktop_items', JSON.stringify(items)); 
  }, [items]);
  
  useEffect(() => { 
    localStorage.setItem('bookmate_desktop_settings', JSON.stringify(settings)); 
  }, [settings]);

  // CRUD Operations
  const createItem = (title: string, type: string, parentId: string | null) => {
    const newItem: Item = {
      id: Date.now().toString(),
      title,
      type: type as 'folder' | 'session',
      parentId,
      color: 'blue',
      createdAt: Date.now(),
      status: 'active',
      questions: [1],
      answers: {},
      results: {},
      bookmarks: [],
      notes: {},
      positiveMark: settings.defaultPositive,
      negativeMark: settings.defaultNegative,
      sessionAutoAdvance: settings.autoAdvance,
      lastAccessed: Date.now()
    };
    setItems([...items, newItem]);
    
    if(type === 'open_session') {
      setCurrentSessionId(parentId);
      setView('session');
    }
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates, lastAccessed: Date.now() } : i));
  };

  const deleteItem = (id: string) => {
    const getIdsToDelete = (itemId: string): string[] => {
      const children = items.filter(i => i.parentId === itemId);
      let ids = [itemId];
      children.forEach(child => {
        ids = [...ids, ...getIdsToDelete(child.id)];
      });
      return ids;
    };
    const idsToDelete = getIdsToDelete(id);
    setItems(prev => prev.filter(i => !idsToDelete.includes(i.id)));
  };

  const addQuestion = (id: string) => {
    const session = items.find(s => s.id === id);
    if (!session) return;
    const lastQ = session.questions[session.questions.length - 1] || 0;
    updateItem(id, { questions: [...session.questions, lastQ + 1] });
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  // Exports
  const exportData = (session: Item, stats: any, settings: Settings) => {
    const labels = settings.labelType === 'ABCD' ? ['A','B','C','D'] : ['1','2','3','4'];
    let content = `BOOKMATE REPORT\n================\nTitle: ${session.title}\nDate: ${new Date().toLocaleDateString()}\nScore: ${stats.score} (Accuracy: ${stats.accuracy}%)\n\n`;
    session.questions.forEach(q => {
      const ans = session.answers[q];
      const res = session.results[q];
      const note = (session.notes||{})[q];
      const label = ans !== undefined ? labels[ans] : '-';
      const status = res ? `[${res.toUpperCase()}]` : '[UNCHECKED]';
      const mark = (session.bookmarks||[]).includes(q) ? ' [BOOKMARKED]' : '';
      content += `Q${q}${mark}: ${label} ${status}${note ? ` | Note: ${note}` : ''}\n`;
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    link.download = `${session.title.replace(/\s+/g,'_')}_Report.txt`;
    link.click();
  };

  const shareData = async (session: Item, stats: any) => {
    const text = `I scored ${stats.score} marks in "${session.title}" with BookMate! (${stats.accuracy}% Accuracy).`;
    if (navigator.share) {
      try { 
        await navigator.share({ title: 'BookMate Result', text }); 
      } catch(e) {}
    } else { 
      navigator.clipboard.writeText(text); 
      alert('Result copied to clipboard!'); 
    }
  };

  return (
    <div className={`font-sans antialiased selection:bg-blue-500 selection:text-white ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {view === 'dashboard' && (
        <DashboardView 
          items={items}
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
          onOpenSettings={() => setView('settings')}
          onCreateItem={createItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />
      )}
      
      {view === 'settings' && (
        <SettingsView 
          settings={settings} 
          setSettings={setSettings} 
          onBack={() => setView('dashboard')} 
        />
      )}

      {view === 'session' && currentSessionId && (
        <SessionView 
          session={items.find(s => s.id === currentSessionId)!} 
          settings={settings} 
          onBack={() => setView('dashboard')} 
          onUpdateSession={updateItem} 
          onAddQuestion={addQuestion} 
          onExport={exportData} 
          onShare={shareData} 
        />
      )}
    </div>
  );
}
