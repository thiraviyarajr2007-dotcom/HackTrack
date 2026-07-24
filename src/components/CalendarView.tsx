import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';
import { HackathonItem } from '../types';

interface CalendarViewProps {
  hackathons: HackathonItem[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ hackathons }) => {
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  // Days of current month simulation grid
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const eventsOnDays: Record<number, { title: string; type: string }[]> = {
    5: [{ title: 'HackNova 2026 Pitch Demo', type: 'Demo' }],
    12: [{ title: 'AI Hackathon Reg Closes', type: 'Registration' }],
    18: [{ title: 'DevDevs Final Submission', type: 'Submission' }],
    25: [{ title: 'Web3 Builder Hackathon PPT', type: 'PPT' }],
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">14️⃣ Hackathon Deadlines Calendar</h1>
          </div>
          <p className="text-xs text-slate-400">
            Monthly schedule tracking registration deadlines, submission cutoffs, and pitch events.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
          <button className="p-1 hover:text-purple-400 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold">{currentMonth}</span>
          <button className="p-1 hover:text-purple-400 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2 border-b border-slate-800 pb-2">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const events = eventsOnDays[day] || [];
            const isToday = day === 23;

            return (
              <div
                key={day}
                className={`min-h-[85px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-purple-950/30 border-purple-500/50 ring-1 ring-purple-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? 'w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center'
                      : 'text-slate-400'
                  }`}
                >
                  {day}
                </span>

                <div className="space-y-1 my-1">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className="text-[9px] p-1 rounded bg-purple-600/30 text-purple-200 font-semibold truncate border border-purple-500/30"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
