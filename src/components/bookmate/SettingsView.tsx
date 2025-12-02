import React, { useState } from 'react';
import { ChevronLeft, Sun, Moon, Monitor, HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { UserGuideModal } from './UserGuideModal';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  labelType: 'ABCD' | '1234';
  defaultPositive: number;
  defaultNegative: number;
  autoAdvance: boolean;
}

interface SettingsViewProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings, onBack }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 animate-in slide-in-from-right duration-300">
      <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8 pt-4">
          <Button size="icon" variant="secondary" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
        </div>
        
        {/* Theme Engine */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Theme</h2>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button 
              onClick={() => setSettings(s => ({...s, theme: 'light'}))} 
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${settings.theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <div className="flex items-center justify-center gap-2"><Sun size={14}/> Light</div>
            </button>
            <button 
              onClick={() => setSettings(s => ({...s, theme: 'dark'}))} 
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${settings.theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <div className="flex items-center justify-center gap-2"><Moon size={14}/> Dark</div>
            </button>
            <button 
              onClick={() => setSettings(s => ({...s, theme: 'system'}))} 
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${settings.theme === 'system' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <div className="flex items-center justify-center gap-2"><Monitor size={14}/> System</div>
            </button>
          </div>
        </section>

        {/* Config */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Exam Defaults</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSettings(s => ({...s, labelType: 'ABCD'}))} 
                className={`py-3 rounded-xl font-bold border transition-all ${settings.labelType === 'ABCD' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
              >
                A B C D
              </button>
              <button 
                onClick={() => setSettings(s => ({...s, labelType: '1234'}))} 
                className={`py-3 rounded-xl font-bold border transition-all ${settings.labelType === '1234' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
              >
                1 2 3 4
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Correct (+)</label>
                <input 
                  type="number" 
                  value={settings.defaultPositive} 
                  onChange={e => setSettings(s => ({...s, defaultPositive: Number(e.target.value)}))} 
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center font-mono font-bold text-green-600" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Wrong (-)</label>
                <input 
                  type="number" 
                  value={settings.defaultNegative} 
                  onChange={e => setSettings(s => ({...s, defaultNegative: Number(e.target.value)}))} 
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center font-mono font-bold text-red-500" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Support</h2>
          <button 
            onClick={() => setShowGuide(true)} 
            className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-4 rounded-xl flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                <HelpCircle size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white">Open User Manual</h3>
                <p className="text-xs text-gray-500">Learn how to use folders & grading</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>
      </div>
    </div>
  );
};
