import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  DollarSign,
  PieChart,
} from 'lucide-react';
import { HackathonItem, AchievementItem, ExpenseItem } from '../types';

interface AnalyticsViewProps {
  hackathons: HackathonItem[];
  achievements?: AchievementItem[];
  expenses?: ExpenseItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  hackathons = [],
  achievements = [],
  expenses = [],
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'Allocate 2 hours on Day 1 exclusively for Figma prototype validation before writing code.',
    'Increase automated API integration test coverage to reduce last-minute submission bugs.',
    'Record your 2-minute Video Demo 12 hours before the final deadline to allow render buffer.',
  ]);

  // Dynamic calculations based on real workspace props
  const totalHackathons = hackathons.length;
  const completedCount = hackathons.filter(
    (h) => h.status === 'Won' || h.status === 'Submitted'
  ).length;
  const activeCount = hackathons.filter(
    (h) => h.status === 'Registered' || h.status === 'In Progress'
  ).length;
  const wonCount =
    hackathons.filter((h) => h.status === 'Won').length +
    achievements.filter((a) => a.type === 'Winner' || a.type === 'Runner Up').length;

  const winRate = totalHackathons > 0 ? Math.round((wonCount / totalHackathons) * 100) : 0;

  const totalExpenseSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Extract skills dynamically from tech stack across all hackathons
  const skillFrequencyMap: Record<string, number> = {};
  hackathons.forEach((h) => {
    if (Array.isArray(h.techStack)) {
      h.techStack.forEach((stk) => {
        const clean = stk.trim();
        if (clean) {
          skillFrequencyMap[clean] = (skillFrequencyMap[clean] || 0) + 1;
        }
      });
    }
  });

  const topSkillsList = Object.entries(skillFrequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const handleGenerateSuggestions = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/analytics-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedCount: completedCount || totalHackathons,
          winRate: `${winRate}%`,
          topSkills: topSkillsList.map(([sk]) => sk),
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">
            Post-Hackathon Growth Analytics
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          In-depth post-hackathon growth insights, win rate trends, skill mastery metrics, and AI recommendations calculated from your workspace.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.01, translateY: -2 }}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Hackathons</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalHackathons}</div>
          <span className="text-[10px] text-slate-500">
            {completedCount} Completed • {activeCount} Active
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01, translateY: -2 }}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Winning Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{winRate}%</div>
          <span className="text-[10px] text-slate-500">{wonCount} Winning / Trophy Finishes</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01, translateY: -2 }}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Expense Budget</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">₹{totalExpenseSpent}</div>
          <span className="text-[10px] text-slate-500">{expenses.length} Logged Expense Items</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01, translateY: -2 }}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Primary Skill Focus</span>
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-black text-cyan-300 font-mono truncate">
            {topSkillsList.length > 0 ? topSkillsList[0][0] : 'React / Node.js'}
          </div>
          <span className="text-[10px] text-slate-500">
            {topSkillsList.length > 0 ? `${topSkillsList[0][1]} Projects Built` : 'Ready to build'}
          </span>
        </motion.div>
      </div>

      {/* Skills Mastery & Weakness Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <Zap className="w-4 h-4 mr-1.5 text-amber-400" /> Technical Skills Mastery Distribution
          </h2>

          <div className="space-y-4 text-xs">
            {topSkillsList.length > 0 ? (
              topSkillsList.map(([skillName, count], idx) => {
                const percentage = Math.min(100, Math.max(35, (count / totalHackathons) * 100 || 80));
                const colors = [
                  'bg-purple-500 text-purple-400',
                  'bg-indigo-500 text-indigo-400',
                  'bg-emerald-500 text-emerald-400',
                  'bg-amber-500 text-amber-400',
                ];
                const color = colors[idx % colors.length];
                const bgBar = color.split(' ')[0];
                const textColor = color.split(' ')[1];

                return (
                  <div key={skillName}>
                    <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                      <span>{skillName}</span>
                      <span className={`font-bold ${textColor}`}>{Math.round(percentage)}% Mastery</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full ${bgBar} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="space-y-3">
                {[
                  { name: 'React 19 & Tailwind CSS', pct: 90, bar: 'bg-purple-500', text: 'text-purple-400' },
                  { name: 'Gemini AI API & Prompt Design', pct: 85, bar: 'bg-indigo-500', text: 'text-indigo-400' },
                  { name: 'Express & TypeScript Backends', pct: 80, bar: 'bg-emerald-500', text: 'text-emerald-400' },
                  { name: 'Pitch & Video Demo Prep', pct: 75, bar: 'bg-amber-500', text: 'text-amber-400' },
                ].map((sk, idx) => (
                  <div key={sk.name}>
                    <div className="flex justify-between text-slate-300 mb-1 font-medium">
                      <span>{sk.name}</span>
                      <span className={`font-bold ${sk.text}`}>{sk.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sk.pct}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full ${sk.bar} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                <span>Refresh AI Advice</span>
              </button>
            </div>

            <div className="space-y-3">
              {aiSuggestions.map((sug, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200 leading-relaxed">{sug}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Powered by AI Gateway (Primary with fallback) evaluating real workspace analytics.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

