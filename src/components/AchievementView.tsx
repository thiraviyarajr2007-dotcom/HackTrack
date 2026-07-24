import React, { useState } from 'react';
import { Award, Trophy, Medal, Plus, ExternalLink, Trash2, X } from 'lucide-react';
import { AchievementItem } from '../types';

interface AchievementViewProps {
  achievements: AchievementItem[];
  onAddAchievement: (item: AchievementItem) => void;
  onDeleteAchievement: (id: string) => void;
}

export const AchievementView: React.FC<AchievementViewProps> = ({
  achievements,
  onAddAchievement,
  onDeleteAchievement,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'Winner' | 'Runner Up' | 'Top 10' | 'Participation'>('Winner');
  const [formPrize, setFormPrize] = useState('₹1,50,000');
  const [formDesc, setFormDesc] = useState('');

  const getTrophyIcon = (type: string) => {
    switch (type) {
      case 'Winner':
        return <Trophy className="w-8 h-8 text-amber-300" />;
      case 'Runner Up':
        return <Medal className="w-8 h-8 text-slate-300" />;
      case 'Top 10':
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return <Award className="w-8 h-8 text-purple-400" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newItem: AchievementItem = {
      id: `ach_${Date.now()}`,
      hackathonName: formName,
      type: formType,
      prizeWon: formPrize,
      certificateUrl: '#',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      description: formDesc || 'Hackathon prize and certificate achieved.',
      badgeColor: 'from-purple-600 to-indigo-800',
    };

    onAddAchievement(newItem);
    setShowAdd(false);
    setFormName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">13️⃣ Achievements & Certificates</h1>
          </div>
          <p className="text-xs text-slate-400">
            Trophy showcase for Winners, Runner Ups, Top 10 Finalists, Participation Badges & Certificates.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trophy / Badge</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                  {getTrophyIcon(item.type)}
                </div>

                <button
                  onClick={() => onDeleteAchievement(item.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <span
                className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border mb-2 inline-block ${
                  item.type === 'Winner'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : item.type === 'Runner Up'
                    ? 'bg-slate-300/10 text-slate-200 border-slate-400/30'
                    : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                }`}
              >
                {item.type === 'Winner' ? '🏆 Winner' : item.type === 'Runner Up' ? '🥈 Runner Up' : item.type}
              </span>

              <h3 className="text-base font-bold text-white mt-1">{item.hackathonName}</h3>
              <p className="text-xs text-emerald-400 font-bold font-mono my-1">{item.prizeWon}</p>
              <p className="text-xs text-slate-400 mb-4">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">{item.date}</span>
              <a
                href={item.certificateUrl}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold flex items-center space-x-1"
              >
                <span>Certificate</span> <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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

            <h2 className="text-base font-bold text-white mb-4">Add Achievement Badge</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Hackathon Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ChainHack Web3 2026"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Achievement Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Winner">🏆 Winner</option>
                    <option value="Runner Up">🥈 Runner Up</option>
                    <option value="Top 10">🎖 Top 10</option>
                    <option value="Participation">Participation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Prize / Grant Won</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,50,000"
                    value={formPrize}
                    onChange={(e) => setFormPrize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Award details and project summary..."
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
                  Save Trophy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
