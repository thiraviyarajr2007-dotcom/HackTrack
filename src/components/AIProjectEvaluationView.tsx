import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Code2,
  Zap,
  Target,
  Lightbulb,
  ExternalLink,
  Github,
  Video,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { HackathonItem } from '../types';

interface AIProjectEvaluationViewProps {
  hackathons: HackathonItem[];
}

export const AIProjectEvaluationView: React.FC<AIProjectEvaluationViewProps> = ({ hackathons }) => {
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathons[0]?.id || '');
  const selectedHackathon = hackathons.find((h) => h.id === selectedHackathonId) || hackathons[0];

  // Input states
  const [projectName, setProjectName] = useState(selectedHackathon?.name || 'MediMind AI');
  const [problemStatement, setProblemStatement] = useState(
    'Clinical documentation takes doctors 3+ hours daily, leading to burnout and diagnostic coding errors in busy ER settings.'
  );
  const [techStack, setTechStack] = useState('React, Express, Gemini 3.6 Flash, Tailwind CSS, PostgreSQL');
  const [githubUrl, setGithubUrl] = useState(selectedHackathon?.github || 'https://github.com/team/medimind-ai');
  const [demoVideoUrl, setDemoVideoUrl] = useState('https://youtube.com/watch?v=medimind-demo');
  const [pptUrl, setPptUrl] = useState(selectedHackathon?.drive || 'https://drive.google.com/ppt-deck');
  const [description, setDescription] = useState(
    selectedHackathon?.description || 'Real-time AI clinical documentation assistant extracting diagnostic notes from ambient patient dialogue with local fallback.'
  );

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [evaluation, setEvaluation] = useState<any>({
    totalScore: 88,
    scores: {
      codeQuality: 23,
      scalability: 21,
      problemAlignment: 24,
      innovation: 22,
    },
    codeQualityAnalysis:
      'Express backend properly isolates GEMINI_API_KEY from browser exposure. Clean TypeScript interfaces and modular React view components. Error boundary handling prevents white-screen crashes on network timeout.',
    scalabilityAnalysis:
      'Current architecture relies on synchronous API calls to Gemini. High throughput under 100+ concurrent doctor requests requires adding a Redis queue or asynchronous SSE streaming.',
    problemAlignmentAnalysis:
      'Direct focus on clinical data extraction pain point. UI minimizes cognitive overload for physicians, staying true to the core problem statement without feature bloat.',
    innovationAnalysis:
      'Highly impactful integration of Gemini 3.6 Flash structured JSON mode combined with AI Judge Q&A simulation. Excellent competitive edge for hackathon podium placement.',
    actionableSuggestions: [
      {
        category: 'Code Quality',
        suggestion: 'Wrap all async Express handlers in centralized error middlewares to return standard JSON 500 error responses.',
        priority: 'High',
      },
      {
        category: 'Scalability',
        suggestion: 'Implement response caching for static prompt queries and add rate-limiting headers on Express route proxies.',
        priority: 'High',
      },
      {
        category: 'Problem Alignment',
        suggestion: 'Add an offline draft auto-save indicator in UI to guarantee zero data loss if doctor loses internet connectivity.',
        priority: 'Medium',
      },
      {
        category: 'Presentation & Pitch',
        suggestion: 'Emphasize the 30-second live AI extraction speed during the first 15 seconds of your demo video.',
        priority: 'Medium',
      },
    ],
  });

  const handleSelectHackathonChange = (id: string) => {
    setSelectedHackathonId(id);
    const h = hackathons.find((item) => item.id === id);
    if (h) {
      setProjectName(h.name);
      setDescription(h.description || '');
      setGithubUrl(h.github || '');
      setPptUrl(h.drive || '');
    }
  };

  const handleRunEvaluation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/project-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          problemStatement,
          techStack,
          githubUrl,
          demoVideoUrl,
          pptUrl,
          description,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setEvaluation(json.data);
      }
    } catch (err) {
      console.error('Error running evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    const text = `🏆 HackTrack AI Project Evaluation Report for "${projectName}"
Total Score: ${evaluation?.totalScore || 88}/100
- Code Quality: ${evaluation?.scores?.codeQuality}/25
- Scalability: ${evaluation?.scores?.scalability}/25
- Problem Alignment: ${evaluation?.scores?.problemAlignment}/25
- Innovation: ${evaluation?.scores?.innovation}/25

💡 Key Suggestions:
${evaluation?.actionableSuggestions?.map((s: any) => `- [${s.category}] (${s.priority}): ${s.suggestion}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-[#fafafa] font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#fafafa]">
              AI Project Evaluation & Audit
            </h1>
          </div>
          <p className="text-xs text-[#71717a] mt-0.5">
            Automated deep analysis of Code Quality, Scalability, Problem Statement Alignment, and Innovation.
          </p>
        </div>

        <button
          onClick={handleCopyReport}
          className="px-3 py-1.5 text-xs font-bold rounded bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] border border-[#27272a] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Report Copied!' : 'Copy Evaluation Summary'}</span>
        </button>
      </div>

      {/* Input Form Section */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
          <span className="text-xs font-bold uppercase text-[#71717a] tracking-wider">
            Submission Details for AI Analysis
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#71717a]">Quick Preset:</span>
            <select
              value={selectedHackathonId}
              onChange={(e) => handleSelectHackathonChange(e.target.value)}
              className="px-2 py-0.5 bg-[#09090b] border border-[#27272a] rounded text-xs text-[#fafafa] focus:outline-none"
            >
              {hackathons.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[#a1a1aa] mb-1 font-medium">Project Name *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[#a1a1aa] mb-1 font-medium">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[#a1a1aa] mb-1 font-medium">Problem Statement</label>
            <textarea
              rows={2}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Describe the exact user pain point being solved..."
              className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:col-span-2">
            <div>
              <label className="block text-[#a1a1aa] mb-1 font-medium flex items-center gap-1">
                <Github className="w-3 h-3 text-blue-400" /> GitHub Repository
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[#a1a1aa] mb-1 font-medium flex items-center gap-1">
                <Video className="w-3 h-3 text-red-400" /> Demo Video URL
              </label>
              <input
                type="text"
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[#a1a1aa] mb-1 font-medium flex items-center gap-1">
                <FileText className="w-3 h-3 text-purple-400" /> PPT / Slide Deck Link
              </label>
              <input
                type="text"
                value={pptUrl}
                onChange={(e) => setPptUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={loading}
          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded shadow-[0_0_12px_#9333ea] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
          <span>{loading ? 'Evaluating Submission with Gemini AI...' : 'Run Deep AI Project Audit'}</span>
        </button>
      </div>

      {/* Evaluation Results Banner */}
      {evaluation && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Total Score Box */}
            <div className="md:col-span-1 bg-[#18181b] border border-purple-500/30 p-4 rounded-lg flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-[10px] text-[#71717a] uppercase font-bold tracking-wider">Overall Score</span>
              <div className="text-3xl font-mono font-bold text-emerald-400 my-1">
                {evaluation.totalScore || 88}/100
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Podium Contender 🏆
              </span>
            </div>

            {/* 4 Core Dimensions */}
            <div className="md:col-span-4 bg-[#18181b] border border-[#27272a] p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2 rounded bg-[#09090b] border border-[#27272a]">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Quality</span>
                </div>
                <div className="text-xl font-mono font-bold text-[#fafafa] mt-1">
                  {evaluation.scores?.codeQuality || 23}<span className="text-xs text-[#71717a]">/25</span>
                </div>
              </div>

              <div className="p-2 rounded bg-[#09090b] border border-[#27272a]">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Scalability</span>
                </div>
                <div className="text-xl font-mono font-bold text-[#fafafa] mt-1">
                  {evaluation.scores?.scalability || 21}<span className="text-xs text-[#71717a]">/25</span>
                </div>
              </div>

              <div className="p-2 rounded bg-[#09090b] border border-[#27272a]">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <Target className="w-3.5 h-3.5" />
                  <span>Alignment</span>
                </div>
                <div className="text-xl font-mono font-bold text-[#fafafa] mt-1">
                  {evaluation.scores?.problemAlignment || 24}<span className="text-xs text-[#71717a]">/25</span>
                </div>
              </div>

              <div className="p-2 rounded bg-[#09090b] border border-[#27272a]">
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Innovation</span>
                </div>
                <div className="text-xl font-mono font-bold text-[#fafafa] mt-1">
                  {evaluation.scores?.innovation || 22}<span className="text-xs text-[#71717a]">/25</span>
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Detailed Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3 space-y-2">
              <h3 className="font-bold text-blue-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Code Quality & Architecture Audit
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed bg-[#09090b] p-2.5 rounded border border-[#27272a]">
                {evaluation.codeQualityAnalysis}
              </p>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3 space-y-2">
              <h3 className="font-bold text-amber-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Scalability & Performance Bottlenecks
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed bg-[#09090b] p-2.5 rounded border border-[#27272a]">
                {evaluation.scalabilityAnalysis}
              </p>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3 space-y-2">
              <h3 className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Problem Alignment & Scope Verification
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed bg-[#09090b] p-2.5 rounded border border-[#27272a]">
                {evaluation.problemAlignmentAnalysis}
              </p>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3 space-y-2">
              <h3 className="font-bold text-purple-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Innovation & AI Technical Edge
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed bg-[#09090b] p-2.5 rounded border border-[#27272a]">
                {evaluation.innovationAnalysis}
              </p>
            </div>
          </div>

          {/* Actionable Improvement Suggestions */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-[#fafafa] uppercase text-xs tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Actionable Recommendations for Higher Podium Placement
              </span>
              <span className="text-[10px] text-[#71717a] font-mono">
                {evaluation.actionableSuggestions?.length || 0} Priority Items
              </span>
            </h3>

            <div className="space-y-2">
              {evaluation.actionableSuggestions?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#09090b] border border-[#27272a] p-2.5 rounded flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-300">{item.category}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          item.priority === 'High'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>
                    <p className="text-[#a1a1aa]">{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
