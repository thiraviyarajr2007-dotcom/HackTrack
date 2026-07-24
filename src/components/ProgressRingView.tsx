import React, { useState } from 'react';
import { PieChart, Sliders, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

interface ProgressRingViewProps {
  initialUi?: number;
  initialBackend?: number;
  initialDatabase?: number;
  initialTesting?: number;
}

export const ProgressRingView: React.FC<ProgressRingViewProps> = ({
  initialUi = 80,
  initialBackend = 45,
  initialDatabase = 90,
  initialTesting = 20,
}) => {
  const [ui, setUi] = useState(initialUi);
  const [backend, setBackend] = useState(initialBackend);
  const [database, setDatabase] = useState(initialDatabase);
  const [testing, setTesting] = useState(initialTesting);

  const overall = Math.round((ui + backend + database + testing) / 4);

  // Circular SVG ring math
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">7️⃣ Progress Ring</h1>
        </div>
        <p className="text-xs text-slate-400">
          Domain-specific completion rings tracking UI, Backend, Database, Testing, and Overall project readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Central Radial Ring Showcase */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Overall Project Completion
          </h2>

          <div className="relative flex items-center justify-center my-2">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#gradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">{overall}%</span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-0.5">
                Overall Score
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 max-w-xs">
            {overall >= 80
              ? '🏆 Submission Ready! All domain modules completed.'
              : overall >= 50
              ? '🟡 Great progress! Backend & Testing need remaining focus.'
              : '🔴 Building phase in progress.'}
          </p>
        </div>

        {/* Domain Sliders & Cards */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <Sliders className="w-4 h-4 mr-1.5 text-purple-400" /> Domain Breakdown Controls
            </span>
            <button
              onClick={() => {
                setUi(80);
                setBackend(45);
                setDatabase(90);
                setTesting(20);
              }}
              className="text-xs text-purple-400 hover:underline flex items-center cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Reset Defaults
            </button>
          </div>

          <div className="space-y-5">
            {/* UI Progress */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-slate-200">UI / UX Design & Components</span>
                <span className="font-extrabold text-purple-400">{ui}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ui}
                onChange={(e) => setUi(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Backend Progress */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-slate-200">Backend & Gemini API Integration</span>
                <span className="font-extrabold text-indigo-400">{backend}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={backend}
                onChange={(e) => setBackend(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Database Progress */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-slate-200">Database & Persistent Storage</span>
                <span className="font-extrabold text-emerald-400">{database}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={database}
                onChange={(e) => setDatabase(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Testing Progress */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-slate-200">Testing, QA & Demo Recording</span>
                <span className="font-extrabold text-amber-400">{testing}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={testing}
                onChange={(e) => setTesting(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
