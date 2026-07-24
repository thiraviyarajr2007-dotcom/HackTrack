import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Code2, AlertCircle, CheckCircle2, Loader2, Copy, Check } from 'lucide-react';

export const AICodeReviewerView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState(`// Express server handler
app.post('/api/ai/idea-generator', async (req, res) => {
  const { category } = req.body;
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: \`Suggest a project for \${category}\`,
  });
  res.json({ result: response.text });
});`);

  const [reviewResult, setReviewResult] = useState({
    securityRating: 'A+',
    performanceRating: 'A',
    suggestions: [
      'Good practice: Keeping process.env.GEMINI_API_KEY on the server prevents public client leakage.',
      'Enhancement: Wrap the async handler in a try/catch block to return a 500 JSON error if network drops.',
      'Optimization: Lazy-initialize the GoogleGenAI instance outside the endpoint handler to avoid reinstantiating on every request.',
    ],
    refactoredCode: `// Optimized Express server handler with error boundary
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/ai/idea-generator', async (req, res) => {
  try {
    const { category } = req.body;
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: \`Suggest a project for \${category}\`,
    });
    res.json({ success: true, result: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate AI concept.' });
  }
});`,
  });

  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    if (!codeSnippet.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSnippet }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviewResult(data.data);
      }
    } catch (err) {
      console.error('Error conducting AI code review:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reviewResult.refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      <div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-black text-white">AI Code Reviewer & Security Inspector</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Paste your hackathon code snippets to audit API key security, performance bottlenecks, and receive clean refactoring suggestions from Gemini 3.6 Flash.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase">Input Code Snippet:</label>
          <textarea
            rows={12}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />

          <button
            onClick={handleReview}
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-lg shadow-purple-600/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            <span>Audit Code Quality & Security</span>
          </button>
        </div>

        {/* Review Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase">Audit Results</span>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Security: {reviewResult.securityRating}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Performance: {reviewResult.performanceRating}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-purple-300 uppercase">Suggestions:</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {reviewResult.suggestions.map((s, idx) => (
                <li key={idx} className="flex items-start space-x-2 p-2 rounded bg-slate-950 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-400 uppercase">Refactored Code:</h3>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-800 text-slate-200 flex items-center space-x-1 cursor-pointer hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800 whitespace-pre-wrap">
              {reviewResult.refactoredCode}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
