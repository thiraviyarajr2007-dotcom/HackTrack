import React, { useState } from 'react';
import { UserCheck, Sparkles, Send, Loader2, Bot, HelpCircle } from 'lucide-react';
import { HackathonItem } from '../types';

interface AIJudgeSimulatorViewProps {
  hackathons: HackathonItem[];
}

export const AIJudgeSimulatorView: React.FC<AIJudgeSimulatorViewProps> = ({ hackathons }) => {
  const [selectedHackathon, setSelectedHackathon] = useState(hackathons[0]?.name || 'MediMind AI');
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(
    'Judge (Senior AI Engineer): How does MediMind AI prevent hallucination when extracting medical diagnoses from unstructured doctor notes?'
  );

  const [qaHistory, setQaHistory] = useState([
    {
      q: 'Judge (VC Investor): What is your customer acquisition strategy for small clinical practices?',
      a: 'We offer a free 30-day trial integrated directly into local EHR systems, followed by a flat $49/doctor monthly tier.',
      feedback: 'Excellent response! Clear pricing model and low barrier to entry.',
      score: '9/10',
    },
  ]);

  const handleAskJudge = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/judge-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: selectedHackathon,
          question: currentQuestion,
          userAnswer: userAnswer,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setQaHistory([
          {
            q: currentQuestion,
            a: userAnswer,
            feedback: json.feedback || 'Good technical grounding!',
            score: `${json.score || 8}/10`,
          },
          ...qaHistory,
        ]);

        if (json.nextQuestion) {
          setCurrentQuestion(json.nextQuestion);
        }
        setUserAnswer('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">AI Hackathon Judge Q&A Simulator</h1>
        </div>
        <p className="text-xs text-slate-400">
          Simulate tough Q&A grilling from VC Investors, Senior AI Engineers, and Product Leads before stepping onto the pitch stage.
        </p>
      </div>

      {/* Active Judge Q&A Box */}
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Bot className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-bold text-amber-300">Live Simulated Judge Prompt</span>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-slate-100 font-medium">
          {currentQuestion}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">Type Your Pitch Answer:</label>
          <textarea
            rows={3}
            placeholder="Explain your technical design, API validation, or business model..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />

          <button
            onClick={handleAskJudge}
            disabled={loading || !userAnswer.trim()}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Submit Pitch Answer for Judge Scoring</span>
          </button>
        </div>
      </div>

      {/* Q&A History */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previous Judge Q&A Sessions</h2>

        {qaHistory.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-bold text-purple-300">{item.q}</span>
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Score: {item.score}
              </span>
            </div>
            <p className="text-slate-300 italic pl-3 border-l-2 border-purple-500">"{item.a}"</p>
            <p className="text-slate-400 text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
              💡 <span className="font-semibold text-slate-200">Judge Feedback:</span> {item.feedback}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
