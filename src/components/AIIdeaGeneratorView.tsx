import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Cpu,
  Layers,
  Presentation,
  DollarSign,
  Copy,
  Check,
  BookmarkPlus,
  Rocket,
  Loader2,
  Stethoscope,
  Bot,
  Sprout,
  Coins,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { AIIdeaResult, HackathonItem, NoteItem } from '../types';

interface AIIdeaGeneratorViewProps {
  onSaveAsNote: (note: NoteItem) => void;
  onAddHackathon: (hackathon: HackathonItem) => void;
}

export const AIIdeaGeneratorView: React.FC<AIIdeaGeneratorViewProps> = ({
  onSaveAsNote,
  onAddHackathon,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Healthcare');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIIdeaResult | null>({
    problem:
      'Students and researchers struggle to locate specialized clinical datasets, analyze unstructured medical notes, and quickly generate formatted research summaries.',
    solution:
      'MediMind AI: A privacy-first generative healthcare search engine that ingests medical documentation, extracts key diagnosis insights, and provides HIPAA-compliant summaries in real time.',
    features: [
      'Automated EHR & Medical Record PDF Summarizer',
      'Symptom-to-Specialist Intelligent Triage Pipeline',
      'Real-time Clinical Research Querying with Gemini Grounding',
      'Interactive Voice-based Doctor-Patient Note Transcriber',
    ],
    techStack: [
      'React 19 + Tailwind CSS',
      'Express Node.js Server',
      '@google/genai SDK (Gemini 3.6 Flash)',
      'PostgreSQL / Firestore Database',
      'Vite & Docker Container Deployment',
    ],
    architecture:
      'Client UI sending encrypted queries to Express Backend -> Gemini 3.6 Flash Server Model -> Vector Search Engine -> Real-time Streaming Response.',
    businessModel:
      'B2B SaaS subscription for private clinics & medical universities, tiered API usage model, plus enterprise white-label licensing.',
    pptOutline: [
      'Slide 1: Problem Statement & Clinical Pain Points',
      'Slide 2: MediMind AI Core Solution & Live Demo',
      'Slide 3: System Architecture & Gemini AI Integration',
      'Slide 4: Market Opportunity & Business Model',
      'Slide 5: Team Credits, Future Roadmap & Impact',
    ],
  });

  const [copied, setCopied] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [createdProject, setCreatedProject] = useState(false);

  const categories = [
    { name: 'Healthcare', icon: Stethoscope },
    { name: 'AI & ML', icon: Bot },
    { name: 'Agriculture', icon: Sprout },
    { name: 'Blockchain', icon: Coins },
    { name: 'Cybersecurity', icon: ShieldCheck },
    { name: 'Education', icon: GraduationCap },
  ];

  const handleGenerateIdea = async () => {
    setLoading(true);
    setSavedNote(false);
    setCreatedProject(false);

    try {
      const res = await fetch('/api/ai/idea-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          customPrompt: customPrompt.trim(),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        alert(json.error || 'Failed to generate idea from AI server.');
      }
    } catch (err: any) {
      console.error('Error calling AI Idea endpoint:', err);
      alert('Error connecting to Gemini AI backend service.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `HACKATHON IDEA: ${selectedCategory}\n\nPROBLEM:\n${result.problem}\n\nSOLUTION:\n${result.solution}\n\nTECH STACK:\n${result.techStack.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotes = () => {
    if (!result) return;
    const note: NoteItem = {
      id: `note_${Date.now()}`,
      hackathonId: 'h1',
      title: `AI Idea: ${selectedCategory} - ${result.solution.slice(0, 30)}...`,
      content: `PROBLEM:\n${result.problem}\n\nSOLUTION:\n${result.solution}\n\nTECH STACK:\n${result.techStack.join(', ')}\n\nARCHITECTURE:\n${result.architecture}`,
      category: 'Quick Notes',
      date: new Date().toISOString().split('T')[0],
      tags: [selectedCategory, 'AI Generator'],
    };
    onSaveAsNote(note);
    setSavedNote(true);
  };

  const handleCreateHackathonProject = () => {
    if (!result) return;
    const newHackathon: HackathonItem = {
      id: `h_${Date.now()}`,
      name: `${selectedCategory} Innovate 2026`,
      status: 'Building',
      daysLeft: 5,
      deadlineDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      prizePool: '₹2,00,000',
      organizer: 'AI Hackathon Association',
      websiteLink: 'https://devfolio.co',
      teamMemberIds: ['m1', 'm2', 'm3'],
      github: 'https://github.com/hacktrack-team',
      figma: 'https://figma.com',
      drive: 'https://drive.google.com',
      submissionLink: 'https://devfolio.co',
      bannerColor: 'from-purple-600/30 to-indigo-900/40',
      description: result.solution,
      domainProgress: { ui: 10, backend: 10, database: 10, testing: 0 },
    };
    onAddHackathon(newHackathon);
    setCreatedProject(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">4️⃣ AI Idea Generator</h1>
        </div>
        <p className="text-xs text-slate-400">
          Powered server-side by Gemini 3.6 Flash. Generates structured problem, solution, tech stack, architecture & 5-slide pitch outlines instantly.
        </p>
      </div>

      {/* Category Pills & Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Select Hackathon Category / Domain:
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Custom Target Context or Specific Problem (Optional):
          </label>
          <input
            type="text"
            placeholder="e.g. Focus on rural healthcare, small farmers, or zero-latency edge AI..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleGenerateIdea}
          disabled={loading}
          className="w-full py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white flex items-center justify-center space-x-2 shadow-xl shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Gemini AI Generating Project Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Hackathon Winner Project Concept</span>
            </>
          )}
        </button>
      </div>

      {/* AI Result Card */}
      {result && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI Output Generated
              </span>
              <span className="text-xs text-slate-400 font-medium">Domain: {selectedCategory}</span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Idea'}</span>
              </button>

              <button
                onClick={handleSaveToNotes}
                className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center space-x-1 cursor-pointer font-semibold"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{savedNote ? 'Saved to Notes!' : 'Save as Note'}</span>
              </button>

              <button
                onClick={handleCreateHackathonProject}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1 cursor-pointer font-bold shadow-md"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>{createdProject ? 'Project Added!' : 'Create Project'}</span>
              </button>
            </div>
          </div>

          {/* Grid Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem & Solution */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center">
                  ⚠️ Problem Statement
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">{result.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center">
                  💡 Solution & Innovation
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">{result.solution}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center">
                  💰 Business & Monetization Model
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">{result.businessModel}</p>
              </div>
            </div>

            {/* Features & Tech Stack */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center">
                  ✨ Core MVP Features
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {result.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center">
                  🛠️ Recommended Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Architecture & PPT Outline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center">
                <Layers className="w-4 h-4 mr-1.5" /> System Architecture Outline
              </h3>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{result.architecture}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center">
                <Presentation className="w-4 h-4 mr-1.5" /> 5-Slide Pitch PPT Outline
              </h3>
              <ul className="space-y-1 text-xs text-slate-300">
                {result.pptOutline.map((slide, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-purple-400 font-bold">Slide {i + 1}:</span>
                    <span>{slide.replace(/^Slide \d+:\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
