import React, { useState } from 'react';
import { Presentation, Sparkles, Copy, Check, Loader2, Download, Layers } from 'lucide-react';
import { HackathonItem } from '../types';

interface AIPptGeneratorViewProps {
  hackathons: HackathonItem[];
}

export const AIPptGeneratorView: React.FC<AIPptGeneratorViewProps> = ({ hackathons }) => {
  const [selectedHackathon, setSelectedHackathon] = useState(hackathons[0]?.name || 'MediMind AI');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slides, setSlides] = useState([
    {
      title: 'Slide 1: Problem Statement',
      content: 'Researchers & doctors waste hours searching scattered medical notes and clinical data.',
    },
    {
      title: 'Slide 2: Our Solution (MediMind AI)',
      content: 'HIPAA-compliant generative medical search engine using Gemini 3.6 Flash.',
    },
    {
      title: 'Slide 3: System Architecture',
      content: 'React 19 Frontend ➔ Express Node Server ➔ Vector Indexing ➔ Gemini AI Stream.',
    },
    {
      title: 'Slide 4: Market Opportunity & Traction',
      content: '$12B HealthTech AI market, 5 beta clinics onboarded, zero data privacy risk.',
    },
    {
      title: 'Slide 5: Team & Roadmap',
      content: 'Rahul (Tech Lead), Ananya (UI/UX), Dev (Backend). Next: Mobile App release.',
    },
  ]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/idea-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Healthcare', customPrompt: `Generate PPT outline for ${selectedHackathon}` }),
      });
      const json = await res.json();
      if (json.success && json.data?.pptOutline) {
        setSlides(
          json.data.pptOutline.map((s: string, idx: number) => ({
            title: `Slide ${idx + 1}: ${s}`,
            content: `Detailed key points for slide ${idx + 1} addressing judge criteria and technical innovation.`,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = slides.map((s) => `${s.title}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center space-x-2">
          <Presentation className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">Presentation PPT Generator</h1>
        </div>
        <p className="text-xs text-slate-400">
          Generate structured 5-slide pitch decks tailored to hackathon judging rubrics.
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
              <span>Generate PPT Slides</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied All Slides!' : 'Copy PPT Outline'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.map((slide, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-xs font-bold text-amber-300">{slide.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">{slide.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
