import React from 'react';
import { HelpCircle, X, Layers, Smartphone, CheckCircle2, FileQuestion, Share2 } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: <Layers className="text-blue-500" />,
      title: "Organization System",
      desc: "Create Subject Folders (e.g., 'Physics') and inside them create Chapters or Sessions. Use the 'Three Dots' menu to rename, delete, or color-code folders."
    },
    {
      icon: <Smartphone className="text-purple-500" />,
      title: "Solving Experience",
      desc: "Tap A/B/C/D to mark answers. Use the Lightning Bolt icon (Zap) in the top bar to toggle 'Auto-Next', which automatically moves to the next question after answering."
    },
    {
      icon: <CheckCircle2 className="text-green-500" />,
      title: "Grading & Scoring",
      desc: "Once done, click 'Submit'. In Grading Mode, tap 'Check Answer' to cycle through Correct (Green), Wrong (Red), or Skipped. Your score updates live based on the +4/-1 scheme (customizable in settings)."
    },
    {
      icon: <FileQuestion className="text-orange-500" />,
      title: "Review Tools",
      desc: "Use the Bookmark icon to flag tricky questions. Add text notes to specific questions to remember mistakes. Filter by 'Bookmarks' in the grading view."
    },
    {
      icon: <Share2 className="text-gray-500" />,
      title: "Export & Share",
      desc: "Use the Printer/Share icons after grading to save your result as a text file report."
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 w-full max-w-md max-h-[80vh] rounded-3xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <HelpCircle className="text-blue-600" /> User Manual
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6">
          {features.map((feat, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl shrink-0">
                {feat.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{feat.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-300 leading-relaxed border border-blue-100 dark:border-blue-900/30">
            <strong>Pro Tip:</strong> All data is saved locally on your device. Clearing browser cache will remove your sessions.
          </div>
        </div>
      </div>
    </div>
  );
};
