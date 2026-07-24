import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Target,
  Sparkles,
  Loader2,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { HackathonItem } from '../types';

interface AnalyticsViewProps {
  hackathons: HackathonItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ hackathons }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'Allocate 2 hours on Day 1 exclusively for Figma prototype validation before writing code.',
    'Increase automated API integration test coverage to reduce last-minute submission bugs.',
    'Record your 2-minute Video Demo 12 hours before the final deadline to allow render buffer.',
  ]);

  const handleGenerateSuggestions = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/analytics-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedCount: 12,
          winRate: '30%',
          topSkills: ['React', 'Gemini AI', 'Node.js', 'PostgreSQL'],
        }),
      });

      const json = await res.json();
      if (json.success && json.suggestions) {
        setAiSuggestions(json.suggestions);
      }
    } catch (err) {
      console.error('Error generating analytics suggestions:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">15️⃣ Post-Hackathon Growth Analytics</h1>
        </div>
        <p className="text-xs text-slate-400">
          In-depth post-hackathon growth insights, win rate trends, skill mastery metrics, and AI recommendations for your next hackathon.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Hackathons</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">16</div>
          <span className="text-[10px] text-slate-500">12 Completed • 4 Active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Winning Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">30%</div>
          <span className="text-[10px] text-slate-500">5 Podium / Trophy Finishes</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Cumulative Prizes Won</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">₹4,20,000</div>
          <span className="text-[10px] text-slate-500">Grants & Cash Prizes</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Top Skill Mastery</span>
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-300 font-mono">Gemini AI / Fullstack</div>
          <span className="text-[10px] text-slate-500">92% Execution Score</span>
        </div>
      </div>

      {/* Skills Mastery & Weakness Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <Zap className="w-4 h-4 mr-1.5 text-amber-400" /> Technical Skills Gained Across 16 Hackathons
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>React 19 & Tailwind CSS UI Design</span>
                <span className="font-bold text-purple-400">95%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Gemini 3.6 AI SDK & Prompt Engineering</span>
                <span className="font-bold text-indigo-400">90%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Express Node.js Backend API Architecture</span>
                <span className="font-bold text-emerald-400">82%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pitch Deck Presentation & Video Demo Editing</span>
                <span className="font-bold text-amber-400">70%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" /> AI Growth Strategy & Suggestions
              </h2>

              <button
                onClick={handleGenerateSuggestions}
                disabled={loadingAi}
                className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Refresh AI Advice</span>
              </button>
            </div>

            <div className="space-y-3">
              {aiSuggestions.map((sug, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200 leading-relaxed">{sug}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Powered by Gemini AI analytics evaluating your historical submission performance.
          </div>
        </div>
      </div>
    </div>
  );
};
