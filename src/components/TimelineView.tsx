import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  Plus,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { TimelineMilestone } from '../types';

interface TimelineViewProps {
  milestones: TimelineMilestone[];
  onToggleStatus: (id: string) => void;
  onAddMilestone: (milestone: TimelineMilestone) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  milestones,
  onToggleStatus,
  onAddMilestone,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formDayNum, setFormDayNum] = useState(6);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newMilestone: TimelineMilestone = {
      id: `tl_${Date.now()}`,
      hackathonId: 'h1',
      dayNumber: Number(formDayNum),
      dayTitle: formTitle,
      description: formDesc || 'Milestone objective details',
      status: 'Pending',
      date: `Day ${formDayNum}`,
    };

    onAddMilestone(newMilestone);
    setShowAdd(false);
    setFormTitle('');
    setFormDesc('');
  };

  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const progressPct = Math.round((completedCount / milestones.length) * 100) || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">6️⃣ Hackathon Timeline</h1>
          </div>
          <p className="text-xs text-slate-400">
            Day-by-day execution roadmap (Day 1 Idea ➔ Day 2 UI ➔ Day 3 Backend ➔ Day 4 Testing ➔ Day 5 Submission).
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Day Milestone</span>
        </button>
      </div>

      {/* Progress Bar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">Roadmap Progress ({completedCount}/{milestones.length} Days Completed)</span>
          <span className="font-bold text-purple-400">{progressPct}% Overall Milestone Completion</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Vertical Timeline Nodes */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-indigo-500 before:to-slate-800">
        {milestones.map((m) => {
          const isCompleted = m.status === 'Completed';
          const isInProgress = m.status === 'In Progress';

          return (
            <div key={m.id} className="relative group">
              {/* Dot Icon Indicator */}
              <button
                onClick={() => onToggleStatus(m.id)}
                className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isInProgress
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-4 ring-purple-500/20 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
                title="Toggle milestone completion"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isInProgress ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </button>

              {/* Milestone Card */}
              <div
                className={`ml-3 p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/60 border-slate-800 opacity-90'
                    : isInProgress
                    ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-900/20'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Day {m.dayNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{m.dayTitle}</h3>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isInProgress
                        ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1">{m.description}</p>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">{m.date}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Milestone Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-white mb-4">Add Day Milestone</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Day Number</label>
                <input
                  type="number"
                  value={formDayNum}
                  onChange={(e) => setFormDayNum(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pitch Practice & Judge Review"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details of what needs to be accomplished on this day..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
