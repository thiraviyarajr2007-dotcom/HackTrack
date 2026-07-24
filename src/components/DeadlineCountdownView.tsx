import React, { useState, useEffect } from 'react';
import { Timer, Clock, Plus, AlertCircle, Calendar, X } from 'lucide-react';
import { DeadlineTimer } from '../types';

interface DeadlineCountdownViewProps {
  deadlines: DeadlineTimer[];
  onAddDeadline: (timer: DeadlineTimer) => void;
}

export const DeadlineCountdownView: React.FC<DeadlineCountdownViewProps> = ({
  deadlines,
  onAddDeadline,
}) => {
  const [now, setNow] = useState(Date.now());
  const [showAdd, setShowAdd] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Submission' | 'PPT' | 'Demo' | 'Registration' | 'Mentoring'>('Submission');
  const [formHours, setFormHours] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatRemaining = (targetIso: string) => {
    const diff = new Date(targetIso).getTime() - now;
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    return { days, hours, mins, secs, expired: false };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newTimer: DeadlineTimer = {
      id: `dl_${Date.now()}`,
      hackathonId: 'h1',
      hackathonName: 'HackNova 2026',
      title: formTitle,
      targetDate: new Date(Date.now() + formHours * 3600 * 1000).toISOString(),
      category: formCategory,
    };

    onAddDeadline(newTimer);
    setShowAdd(false);
    setFormTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">9️⃣ Deadline Countdown</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time ticking timers for Code Submission, PPT Presentation Upload, Video Demo, and Mentoring calls.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Deadline</span>
        </button>
      </div>

      {/* Deadlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deadlines.map((dl) => {
          const rem = formatRemaining(dl.targetDate);
          const isUrgent = rem.days === 0 && rem.hours < 12 && !rem.expired;

          return (
            <div
              key={dl.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden ${
                isUrgent
                  ? 'border-amber-500/50 shadow-amber-900/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {dl.category}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{dl.hackathonName}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 mb-4">{dl.title}</h3>

              {/* Ticking Clock Box */}
              <div
                className={`p-4 rounded-xl text-center border font-mono ${
                  rem.expired
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                    : isUrgent
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-purple-300'
                }`}
              >
                {rem.expired ? (
                  <span className="text-xl font-bold">DEADLINE PASSED</span>
                ) : (
                  <div className="grid grid-cols-4 gap-1">
                    <div>
                      <span className="text-2xl font-black">{rem.days}</span>
                      <span className="block text-[9px] text-slate-500 uppercase font-sans font-semibold">Days</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black">{String(rem.hours).padStart(2, '0')}</span>
                      <span className="block text-[9px] text-slate-500 uppercase font-sans font-semibold">Hours</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black">{String(rem.mins).padStart(2, '0')}</span>
                      <span className="block text-[9px] text-slate-500 uppercase font-sans font-semibold">Mins</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-rose-400 animate-pulse">{String(rem.secs).padStart(2, '0')}</span>
                      <span className="block text-[9px] text-slate-500 uppercase font-sans font-semibold">Secs</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deadline Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-4">Add Custom Deadline Timer</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Timer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PPT Presentation Upload"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Submission">Submission</option>
                    <option value="PPT">PPT</option>
                    <option value="Demo">Demo</option>
                    <option value="Registration">Registration</option>
                    <option value="Mentoring">Mentoring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Time from Now (Hours)</label>
                  <input
                    type="number"
                    value={formHours}
                    onChange={(e) => setFormHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                >
                  Start Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
