import React, { useState } from 'react';
import { MessageSquare, Plus, Check, Clock, User, AlertTriangle } from 'lucide-react';
import { DailyStandupItem, TeamMember } from '../types';

interface DailyStandupViewProps {
  standups: DailyStandupItem[];
  teamMembers: TeamMember[];
  onAddStandup: (item: DailyStandupItem) => void;
}

export const DailyStandupView: React.FC<DailyStandupViewProps> = ({
  standups,
  teamMembers,
  onAddStandup,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState('m1');
  const [yesterdayText, setYesterdayText] = useState('');
  const [todayText, setTodayText] = useState('');
  const [blockersText, setBlockersText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todayText.trim()) return;

    const member = teamMembers.find((m) => m.id === selectedMemberId) || teamMembers[0];

    const newItem: DailyStandupItem = {
      id: `std_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      memberId: member.id,
      memberName: member.name,
      memberRole: member.role,
      memberAvatar: member.avatar,
      yesterday: yesterdayText || 'Worked on project setup.',
      today: todayText,
      blockers: blockersText || 'None',
      timestamp: 'Just now',
    };

    onAddStandup(newItem);
    setSavedSuccess(true);
    setYesterdayText('');
    setTodayText('');
    setBlockersText('');

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">8️⃣ Daily Standup</h1>
        </div>
        <p className="text-xs text-slate-400">
          Daily progress synchronization answering Yesterday, Today, and Blockers for team members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to submit standup */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <Plus className="w-4 h-4 mr-1 text-purple-400" /> Submit Today's Standup
          </h2>

          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Select Member</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">1️⃣ What did you do Yesterday?</label>
              <textarea
                rows={2}
                placeholder="Finished UI component system, designed cards..."
                value={yesterdayText}
                onChange={(e) => setYesterdayText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">2️⃣ What will you do Today? *</label>
              <textarea
                rows={2}
                required
                placeholder="Integrate Express backend API and test Gemini response..."
                value={todayText}
                onChange={(e) => setTodayText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">3️⃣ Any Blockers or Issues?</label>
              <textarea
                rows={2}
                placeholder="None, or waiting for API keys..."
                value={blockersText}
                onChange={(e) => setBlockersText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20 cursor-pointer transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Standup Auto-Saved!</span>
                </>
              ) : (
                <span>Save Standup Entry</span>
              )}
            </button>
          </form>
        </div>

        {/* History log */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Recent Team Standup Logs
          </h2>

          <div className="space-y-4">
            {standups.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <img src={s.memberAvatar} alt={s.memberName} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-white">{s.memberName}</span>
                      <span className="text-[10px] text-slate-500 ml-2">({s.memberRole})</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">{s.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Yesterday
                    </span>
                    <p className="text-slate-300">{s.yesterday}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1">
                      Today
                    </span>
                    <p className="text-slate-200">{s.today}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Blockers
                    </span>
                    <p className="text-slate-300">{s.blockers || 'None'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
