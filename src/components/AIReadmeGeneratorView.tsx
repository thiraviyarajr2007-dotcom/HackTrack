import React, { useState } from 'react';
import { FileCode, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { HackathonItem } from '../types';

interface AIReadmeGeneratorViewProps {
  hackathons: HackathonItem[];
}

export const AIReadmeGeneratorView: React.FC<AIReadmeGeneratorViewProps> = ({ hackathons }) => {
  const [selectedHackathon, setSelectedHackathon] = useState(hackathons[0]?.name || 'HackNova 2026');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [readmeMarkdown, setReadmeMarkdown] = useState(`# MediMind AI - HackNova 2026

> A privacy-first generative healthcare search engine powered by Gemini 3.6 Flash.

## 🚀 Features
- **HIPAA-Compliant Summarizer**: Processes complex medical PDFs in under 2 seconds.
- **Real-time Gemini Streaming**: Direct server-side streaming responses.
- **Interactive UI**: Dark mode dashboard built with React 19 & Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Backend**: Express Node.js, @google/genai SDK
- **Database**: PostgreSQL / Firestore

## ⚙️ Installation & Setup
\`\`\`bash
npm install
npm run dev
\`\`\`
`);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/readme-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: selectedHackathon,
          description: 'All-in-one Hackathon management dashboard & AI assistant',
          techStack: ['React 19', 'Express Node.js', '@google/genai', 'Tailwind CSS'],
          features: ['Real-time AI Idea Generation', 'Kanban Board', 'Judge Simulator'],
        }),
      });

      const json = await res.json();
      if (json.success && json.markdown) {
        setReadmeMarkdown(json.markdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center space-x-2">
          <FileCode className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">GitHub README Generator</h1>
        </div>
        <p className="text-xs text-slate-400">
          Generate production-ready GitHub README.md markdown files with installation steps, tech badges, and features.
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
              <span>Generate README.md</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-mono text-purple-300">README.md Preview</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
          {readmeMarkdown}
        </pre>
      </div>
    </div>
  );
};
