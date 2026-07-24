import React, { useState } from 'react';
import { Mic, Sparkles, Copy, Check, Loader2, Play } from 'lucide-react';
import { HackathonItem } from '../types';

interface AIPitchGeneratorViewProps {
  hackathons: HackathonItem[];
}

export const AIPitchGeneratorView: React.FC<AIPitchGeneratorViewProps> = ({ hackathons }) => {
  const [selectedHackathon, setSelectedHackathon] = useState(hackathons[0]?.name || 'MediMind AI');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [script, setScript] = useState({
    hook: 'Did you know 40% of clinical research time is wasted navigating unstructured medical records?',
    problem: 'Doctors in busy emergency rooms struggle to extract critical patient history under 60 seconds.',
    solution: 'MediMind AI solves this by streaming instant HIPAA-compliant clinical summaries using Gemini 3.6 Flash.',
    demo: 'Watch as I upload this 50-page medical PDF: within 1.5 seconds, our Gemini pipeline extracts diagnoses and flags potential drug interactions.',
    callToAction: 'We are MediMind AI — transforming healthcare research, one query at a time. Thank you!',
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/pitch-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: selectedHackathon,
          targetAudience: 'Hackathon Judges & VCs',
          keyFeatures: ['Gemini 3.6 Flash streaming', 'HIPAA compliant', 'React 19 dashboard'],
        }),
      });

      const json = await res.json();
      if (json.success && json.script) {
        setScript(json.script);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = `ELEVATOR PITCH (2 MINUTES):\n\nHook: ${script.hook}\n\nProblem: ${script.problem}\n\nSolution: ${script.solution}\n\nDemo: ${script.demo}\n\nCTA: ${script.callToAction}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">2-Minute Elevator Pitch Script Generator</h1>
        </div>
        <p className="text-xs text-slate-400">
          Craft high-impact 2-minute spoken pitch scripts with Hook, Problem, Solution, Live Demo cue, and Call To Action.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Project</label>
            <select
              value={selectedHackathon}
              onChange={(e) => setSelectedHackathon(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
            >
              {hackathons.map((h) => (
                <option key={h.id} value={h.name}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>Generate Pitch Script</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            🎤 2-Minute Pitch Speech Script
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Full Script!' : 'Copy Script'}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
            <span className="font-bold text-purple-300 block mb-1">1️⃣ The Hook (0 - 15s)</span>
            <p className="text-slate-200 italic">"{script.hook}"</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">2️⃣ The Problem (15s - 45s)</span>
            <p className="text-slate-300">"{script.problem}"</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">3️⃣ The Solution (45s - 75s)</span>
            <p className="text-slate-300">"{script.solution}"</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">4️⃣ Live Demo Transition Cue (75s - 105s)</span>
            <p className="text-slate-300">"{script.demo}"</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <span className="font-bold text-amber-300 block mb-1">5️⃣ Call to Action (105s - 120s)</span>
            <p className="text-slate-200 font-semibold">"{script.callToAction}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
