import React, { useState, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  Check, 
  X, 
  Share2, 
  Printer, 
  Save, 
  Zap, 
  ZapOff, 
  AlertTriangle, 
  Bookmark, 
  MessageSquare,
  Plus
} from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { SessionTimer } from './SessionTimer';

interface Session {
  id: string;
  title: string;
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
  endTime?: number;
}

interface Settings {
  labelType: 'ABCD' | '1234';
}

interface SessionViewProps {
  session: Session;
  settings: Settings;
  onBack: () => void;
  onUpdateSession: (id: string, updates: Partial<Session>) => void;
  onAddQuestion: (id: string) => void;
  onExport: (session: Session, stats: any, settings: Settings) => void;
  onShare: (session: Session, stats: any) => void;
}

export const SessionView: React.FC<SessionViewProps> = ({ 
  session, 
  settings, 
  onBack, 
  onUpdateSession, 
  onAddQuestion, 
  onExport, 
  onShare 
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks'>('all');
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const stats = useMemo(() => {
    let correct = 0, wrong = 0;
    Object.keys(session.results || {}).forEach(q => {
      if (session.results[Number(q)] === 'correct') correct++;
      if (session.results[Number(q)] === 'wrong') wrong++;
    });
    const score = (correct * (session.positiveMark || 4)) - (wrong * (session.negativeMark || 1));
    const attempted = Object.keys(session.answers || {}).length;
    const total = session.questions.length;
    const accuracy = (correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    return { correct, wrong, score, accuracy, attempted, total };
  }, [session]);

  const handleAnswer = (qNum: number, idx: number) => {
    if (session.status === 'graded') return;
    const current = session.answers[qNum];
    const newAnswers = { ...session.answers };
    if (current === idx) delete newAnswers[qNum];
    else newAnswers[qNum] = idx;
    onUpdateSession(session.id, { answers: newAnswers });
    const isLast = qNum === session.questions[session.questions.length - 1];
    if (session.sessionAutoAdvance && isLast && current !== idx) setTimeout(() => onAddQuestion(session.id), 350);
  };

  const toggleBookmark = (qNum: number) => {
    const bookmarks = session.bookmarks || [];
    const newBookmarks = bookmarks.includes(qNum) ? bookmarks.filter(b => b !== qNum) : [...bookmarks, qNum];
    onUpdateSession(session.id, { bookmarks: newBookmarks });
  };

  const toggleGrading = (qNum: number) => {
    if (session.status !== 'graded') return;
    const current = session.results[qNum];
    const newResults = { ...session.results };
    if (!current) newResults[qNum] = 'correct';
    else if (current === 'correct') newResults[qNum] = 'wrong';
    else delete newResults[qNum];
    onUpdateSession(session.id, { results: newResults });
  };

  const handleNoteChange = (qNum: number, text: string) => {
    const newNotes = { ...(session.notes || {}), [qNum]: text };
    onUpdateSession(session.id, { notes: newNotes });
  };

  const confirmSubmit = () => {
    onUpdateSession(session.id, { status: 'graded', endTime: Date.now() });
    setShowSubmitModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isGrading = session.status === 'graded';
  const labels = settings.labelType === 'ABCD' ? ['A','B','C','D'] : ['1','2','3','4'];
  const displayQuestions = activeTab === 'bookmarks' 
    ? session.questions.filter(q => (session.bookmarks || []).includes(q))
    : session.questions;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col transition-colors duration-300">
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Test?">
        <div className="text-center space-y-4">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-500 w-8 h-8" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">You are about to switch to Grading Mode.</p>
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={confirmSubmit} className="flex-1">Submit</Button>
          </div>
        </div>
      </Modal>

      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b dark:border-gray-800 p-3 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Button size="icon" variant="ghost" onClick={onBack}><ChevronLeft className="dark:text-white" /></Button>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-xs">{session.title}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <SessionTimer startTime={session.createdAt} status={session.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isGrading ? (
              <>
                <button 
                  onClick={() => onUpdateSession(session.id, { sessionAutoAdvance: !session.sessionAutoAdvance })} 
                  className={`p-2 rounded-full transition-colors ${session.sessionAutoAdvance ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}
                >
                  {session.sessionAutoAdvance ? <Zap size={18} fill="currentColor"/> : <ZapOff size={18}/>}
                </button>
                <Button size="sm" variant="success" onClick={() => setShowSubmitModal(true)}><Save size={16} className="mr-1"/> Submit</Button>
              </>
            ) : (
              <>
                <Button size="icon" variant="secondary" onClick={() => onShare(session, stats)}><Share2 size={18} /></Button>
                <Button size="icon" variant="secondary" onClick={() => onExport(session, stats, settings)}><Printer size={18} /></Button>
              </>
            )}
          </div>
        </div>
      </header>

      {isGrading && (
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 animate-in slide-in-from-top-4">
          <div className="max-w-2xl mx-auto p-5 flex flex-col items-center">
            {/* Marking Scheme Config */}
            <div className="w-full flex justify-between items-center mb-6 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
              <span className="text-xs font-bold text-gray-400 uppercase ml-2">Marking:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-green-500 font-bold text-xs">+</span>
                  <input 
                    type="number" 
                    value={session.positiveMark} 
                    onChange={(e) => onUpdateSession(session.id, { positiveMark: Number(e.target.value) })} 
                    className="w-10 bg-white dark:bg-gray-700 text-center rounded border border-gray-200 dark:border-gray-600 text-sm font-bold outline-none" 
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-500 font-bold text-xs">-</span>
                  <input 
                    type="number" 
                    value={session.negativeMark} 
                    onChange={(e) => onUpdateSession(session.id, { negativeMark: Number(e.target.value) })} 
                    className="w-10 bg-white dark:bg-gray-700 text-center rounded border border-gray-200 dark:border-gray-600 text-sm font-bold outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">{stats.score}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Total Score</div>

            {/* Visual Bar */}
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full flex overflow-hidden mb-6">
              <div style={{ width: `${(stats.correct / stats.total) * 100}%` }} className="bg-green-500 h-full" />
              <div style={{ width: `${(stats.wrong / stats.total) * 100}%` }} className="bg-red-500 h-full" />
            </div>

            <div className="grid grid-cols-3 gap-3 w-full mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl text-center">
                <div className="text-xl font-bold text-green-600">{stats.correct}</div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Correct</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl text-center">
                <div className="text-xl font-bold text-red-500">{stats.wrong}</div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Wrong</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl text-center">
                <div className="text-xl font-bold text-blue-500">{stats.accuracy}%</div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Accuracy</div>
              </div>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full">
              <button 
                onClick={() => setActiveTab('all')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('bookmarks')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'bookmarks' ? 'bg-white dark:bg-gray-700 shadow-sm text-red-500' : 'text-gray-500'}`}
              >
                <Bookmark size={14} fill="currentColor" /> {session.bookmarks?.length || 0}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full scroll-smooth">
        <div className="space-y-4 pb-32">
          {displayQuestions.length === 0 && activeTab === 'bookmarks' && (
            <div className="text-center py-20 text-gray-400">
              <Bookmark size={48} className="mx-auto mb-4 opacity-20" />
              <p>No questions bookmarked.</p>
            </div>
          )}

          {displayQuestions.map((qNum) => {
            const answer = session.answers[qNum];
            const result = session.results[qNum];
            const note = (session.notes || {})[qNum] || '';
            const isBookmarked = (session.bookmarks || []).includes(qNum);
            const hasAnswer = answer !== undefined;

            let cardStyle = "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800";
            if (isGrading) {
              if (result === 'correct') cardStyle = "bg-green-50/50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
              else if (result === 'wrong') cardStyle = "bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
            }

            return (
              <div key={qNum} className={`p-4 rounded-2xl border shadow-sm transition-all duration-300 ${cardStyle}`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-400 dark:text-gray-500">Q.{qNum}</span>
                    <button onClick={() => toggleBookmark(qNum)} className="focus:outline-none transition-transform active:scale-90">
                      <Bookmark size={20} fill={isBookmarked ? "#ef4444" : "none"} className={isBookmarked ? "text-red-500" : "text-gray-300 hover:text-red-400"} />
                    </button>
                  </div>

                  {isGrading && hasAnswer && (
                    <button 
                      onClick={() => toggleGrading(qNum)} 
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${result === 'correct' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : result === 'wrong' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'}`}
                    >
                      {result === 'correct' ? <><Check size={12} strokeWidth={4} /> CORRECT</> : result === 'wrong' ? <><X size={12} strokeWidth={4} /> WRONG</> : 'CHECK'}
                    </button>
                  )}
                  {isGrading && !hasAnswer && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">SKIPPED</span>}
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  {labels.map((lbl, idx) => {
                    const isSelected = answer === idx;
                    let btnClass = "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700";
                    if (isSelected) {
                      btnClass = "text-white border-transparent shadow-md";
                      if (isGrading) {
                        if (result === 'correct') btnClass += " bg-green-500";
                        else if (result === 'wrong') btnClass += " bg-red-500";
                        else btnClass += " bg-gray-500";
                      } else {
                        btnClass += " bg-blue-600 dark:bg-blue-600";
                      }
                    }
                    return (
                      <button 
                        key={idx} 
                        disabled={isGrading} 
                        onClick={() => handleAnswer(qNum, idx)} 
                        className={`h-12 rounded-xl text-lg font-bold transition-transform active:scale-95 ${btnClass}`}
                      >
                        {lbl}
                      </button>
                    )
                  })}
                </div>

                {/* Notes Section */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare size={14} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={note}
                    onChange={(e) => handleNoteChange(qNum, e.target.value)}
                    placeholder="Add a revision note..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-black/20 rounded-lg border-none focus:ring-1 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                  />
                </div>
              </div>
            )
          })}

          {!isGrading && (
            <div ref={bottomRef} className="pt-4">
              <Button onClick={() => onAddQuestion(session.id)} variant="secondary" className="w-full py-5 border-dashed border-2 text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400">
                <Plus className="w-5 h-5"/> Add Question {session.questions.length + 1}
              </Button>
            </div>
          )}
        </div>
      </main>

      {!isGrading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-gray-900/90 dark:bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold leading-none">{stats.attempted}</span>
              <span className="text-[10px] text-gray-400 uppercase">Done</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <button onClick={() => onAddQuestion(session.id)} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-transform active:scale-90 hover:scale-110">
              <Plus size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
