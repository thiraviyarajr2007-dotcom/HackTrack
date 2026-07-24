import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  Play,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Users,
  Timer,
  PieChart,
  CheckSquare,
  Square,
  ChevronRight,
  ExternalLink,
  Github,
  Figma,
  Folder,
  Send,
  Zap,
  Check,
  RotateCcw
} from 'lucide-react';
import {
  HackathonItem,
  TaskItem,
  DeadlineTimer,
  DailyStandupItem,
  KanbanStatus,
} from '../types';

interface DashboardViewProps {
  userName?: string;
  hackathons: HackathonItem[];
  tasks: TaskItem[];
  deadlines: DeadlineTimer[];
  standups?: DailyStandupItem[];
  onNavigateView?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onAddTask?: (title: string) => void;
  onToggleTask?: (taskId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: KanbanStatus) => void;
  onLoadSampleData?: () => void;
  onCreateHackathon?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName = 'Sabankumar',
  hackathons,
  tasks,
  deadlines,
  standups = [],
  onNavigateView,
  onNavigate,
  onAddTask,
  onToggleTask,
  onUpdateTaskStatus,
  onLoadSampleData,
  onCreateHackathon,
}) => {
  const navigate = (tab: string) => {
    if (onNavigateView) onNavigateView(tab);
    if (onNavigate) onNavigate(tab);
  };

  const [newTaskInput, setNewTaskInput] = useState('');
  const [activeTasks, setActiveTasks] = useState([
    { id: 't1', title: 'Finish UI Component Library', status: 'Completed', domain: 'Frontend' },
    { id: 't2', title: 'Implement Auth Logic', status: 'In Progress', domain: 'Backend', priority: 'High' },
    { id: 't3', title: 'Record Pitch Video', status: 'In Progress', domain: 'Media' },
    { id: 't4', title: 'Review Judge Criteria', status: 'Pending', domain: 'Strategy' },
  ]);

  const [aiIdea, setAiIdea] = useState({
    title: 'MediChain Connect',
    category: 'Healthcare',
    description: 'Decentralized patient records for emergency responders using RFID/NFC & encrypted local state.',
    tech: ['Next.js', 'Solana', 'Tailwind'],
  });

  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  const handleRegenerateIdea = () => {
    setIsGeneratingIdea(true);
    setTimeout(() => {
      const ideas = [
        {
          title: 'EcoTrace AI',
          category: 'Sustainability',
          description: 'Supply chain carbon audit using satellite imagery and Gemini vision analysis.',
          tech: ['Python', 'Gemini API', 'React'],
        },
        {
          title: 'EduPulse Tutor',
          category: 'Education',
          description: 'Interactive STEM lab coach providing real-time voice feedback during physics experiments.',
          tech: ['TypeScript', 'Live API', 'Canvas'],
        },
        {
          title: 'MediChain Connect',
          category: 'Healthcare',
          description: 'Decentralized patient records for emergency responders using RFID/NFC & encrypted local state.',
          tech: ['Next.js', 'Solana', 'Tailwind'],
        },
      ];
      const next = ideas[Math.floor(Math.random() * ideas.length)];
      setAiIdea(next);
      setIsGeneratingIdea(false);
    }, 600);
  };

  const handleToggleLocalTask = (id: string) => {
    setActiveTasks(
      activeTasks.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    if (onToggleTask) onToggleTask(id);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newT = {
      id: `task_${Date.now()}`,
      title: newTaskInput.trim(),
      status: 'In Progress',
      domain: 'General',
    };
    setActiveTasks([newT, ...activeTasks]);
    if (onAddTask) onAddTask(newTaskInput.trim());
    setNewTaskInput('');
  };

  const activeHackathon = hackathons[0] || {
    name: 'New Hackathon Workspace',
    organizer: 'Pending Organizer',
    status: 'Registered',
    prizePool: '$0 Prize',
    progress: 0,
  };

  return (
    <div className="space-y-4 text-[#fafafa] font-sans pb-12">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => navigate('hackathon-board')}
          className="border border-[#27272a] bg-[#09090b] hover:bg-[#18181b] rounded-lg p-3 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#71717a] uppercase font-semibold">Active Hackathons</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-mono font-bold text-[#fafafa]">{hackathons.length}</span>
            <span className="text-[10px] text-blue-400 font-semibold flex items-center">
              Active <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        <div
          onClick={() => navigate('achievements')}
          className="border border-[#27272a] bg-[#09090b] hover:bg-[#18181b] rounded-lg p-3 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#71717a] uppercase font-semibold">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-mono font-bold text-[#fafafa]">
              {hackathons.filter((h) => h.status === 'Won' || h.status === 'Submitted').length}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">Track Record</span>
          </div>
        </div>

        <div
          onClick={() => navigate('deadlines')}
          className="border border-[#27272a] bg-[#09090b] hover:bg-[#18181b] rounded-lg p-3 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-red-400 uppercase font-semibold">Upcoming Deadlines</span>
            <Clock className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-mono font-bold text-red-400">{deadlines.length}</span>
            <span className="text-[10px] text-red-400 font-mono font-bold">Timers Active</span>
          </div>
        </div>

        <div
          onClick={() => navigate('kanban')}
          className="border border-[#27272a] bg-[#09090b] hover:bg-[#18181b] rounded-lg p-3 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#71717a] uppercase font-semibold">Kanban Tasks</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-mono font-bold text-[#fafafa]">{tasks.length}</span>
            <span className="text-[10px] text-purple-400 font-semibold">Live Board</span>
          </div>
        </div>
      </div>

      {/* Fresh User Empty Workspace Banner if 0 Hackathons */}
      {hackathons.length === 0 && (
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-8 text-center space-y-4 my-2 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] font-semibold mb-1">
              <span>No Hackathons Yet</span>
            </div>
            <h2 className="text-xl font-bold text-[#fafafa]">
              Welcome {userName} 👋
            </h2>
            <p className="text-xs text-[#71717a] max-w-md mx-auto leading-relaxed">
              You haven't created any hackathons yet. Start building your custom project workspace to manage team members, Kanban tasks, deadlines, and AI pitch generators.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onCreateHackathon) onCreateHackathon();
                else navigate('hackathon-board');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create First Hackathon</span>
            </button>

            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                className="px-3.5 py-2 bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] font-semibold text-xs rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Load Demo Sample Data</span>
              </button>
            )}
          </div>

          {/* Quick onboarding roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-6 text-left border-t border-[#27272a]/60 max-w-3xl mx-auto text-xs">
            <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
              <span className="font-mono text-blue-400 font-bold block mb-1">01. Register</span>
              <p className="text-[#71717a] text-[11px]">Add your upcoming hackathon details and links.</p>
            </div>

            <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
              <span className="font-mono text-purple-400 font-bold block mb-1">02. Team Code</span>
              <p className="text-[#71717a] text-[11px]">Generate invite code for team onboarding.</p>
            </div>

            <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
              <span className="font-mono text-emerald-400 font-bold block mb-1">03. Build & Tasks</span>
              <p className="text-[#71717a] text-[11px]">Track domain progress on Kanban board.</p>
            </div>

            <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
              <span className="font-mono text-amber-400 font-bold block mb-1">04. AI Pitch</span>
              <p className="text-[#71717a] text-[11px]">Generate pitch deck & PPT using Gemini AI.</p>
            </div>
          </div>
        </div>
      )}

      {/* High Density Main Grid (Matching Spec Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Row 1 Left: Active Hackathon Challenge Spotlight (col-span-8) */}
        <div className="lg:col-span-8 border border-[#27272a] bg-[#09090b] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#fafafa] flex items-center gap-2">
                {activeHackathon.name}
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">
                Status: <span className="text-yellow-500 font-semibold">🟡 {activeHackathon.status || 'Building'}</span> • Organizer: {activeHackathon.organizer || 'TechCorp'}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/20">
                {activeHackathon.prizePool || '$10,000 Prize'}
              </span>
              <button
                onClick={() => navigate('hackathon-board')}
                className="bg-[#18181b] hover:bg-[#27272a] text-xs px-2 py-0.5 border border-[#27272a] rounded cursor-pointer flex items-center gap-1 text-[#a1a1aa] hover:text-[#fafafa]"
              >
                <span>↗ Site</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {/* Box 1: Circular Progress Ring */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-md p-3 flex flex-col justify-between">
              <p className="text-[10px] text-[#71717a] uppercase font-semibold">Project Progress</p>
              <div className="relative flex-1 flex items-center justify-center my-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#27272a" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#3b82f6"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="201"
                    strokeDashoffset="78"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_#3b82f6]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-mono font-bold text-[#fafafa]">61%</span>
                  <span className="text-[8px] text-[#71717a] uppercase font-semibold">Overall</span>
                </div>
              </div>
              <div className="text-[9px] text-[#a1a1aa] text-center font-mono">
                Tasks: 18/24 Done
              </div>
            </div>

            {/* Box 2: Deadline Countdown */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-md p-3 flex flex-col justify-between">
              <p className="text-[10px] text-[#71717a] uppercase font-semibold">Deadline Countdown</p>
              <div className="space-y-2 my-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-red-400 font-semibold">Submission Target</span>
                  <span className="text-base font-mono font-bold text-red-400">02d : 14h : 22m</span>
                </div>
                <div className="w-full h-1 bg-[#27272a] rounded-full overflow-hidden">
                  <div className="w-[80%] h-full bg-red-500" />
                </div>
                <div className="flex justify-between text-[9px] text-[#71717a] font-mono">
                  <span>PPT: 5h</span>
                  <span>Demo: Tomorrow</span>
                </div>
              </div>
              <button
                onClick={() => navigate('deadlines')}
                className="text-[10px] text-blue-400 hover:underline text-left font-medium cursor-pointer"
              >
                View all timers →
              </button>
            </div>

            {/* Box 3: Quick Resources & Submission Action */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-md p-3 flex flex-col justify-between">
              <p className="text-[10px] text-[#71717a] uppercase font-semibold">Quick Resources</p>
              <div className="space-y-1 my-1">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] flex justify-between items-center p-1.5 bg-[#09090b] hover:bg-[#27272a] rounded text-[#fafafa] transition-colors"
                >
                  <span className="flex items-center gap-1.5"><Github className="w-3 h-3 text-blue-400" /> GitHub</span>
                  <span className="text-blue-400 text-xs">→</span>
                </a>
                <a
                  href="https://figma.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] flex justify-between items-center p-1.5 bg-[#09090b] hover:bg-[#27272a] rounded text-[#fafafa] transition-colors"
                >
                  <span className="flex items-center gap-1.5"><Figma className="w-3 h-3 text-purple-400" /> Figma</span>
                  <span className="text-blue-400 text-xs">→</span>
                </a>
                <button
                  onClick={() => navigate('document-center')}
                  className="w-full text-[11px] flex justify-between items-center p-1.5 bg-[#09090b] hover:bg-[#27272a] rounded text-[#fafafa] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><Folder className="w-3 h-3 text-amber-400" /> Drive Docs</span>
                  <span className="text-blue-400 text-xs">→</span>
                </button>
              </div>

              <button
                onClick={() => navigate('document-center')}
                className="mt-1 bg-blue-600 hover:bg-blue-500 text-center py-1.5 rounded text-xs font-bold text-white shadow-[0_0_12px_#3b82f6] cursor-pointer transition-all"
              >
                Submit Entry
              </button>
            </div>
          </div>
        </div>

        {/* Row 1 Right: Today's Tasks (col-span-4) */}
        <div className="lg:col-span-4 border border-[#27272a] bg-[#18181b] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase text-[#71717a] flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Today's Tasks
              </h3>
              <button
                onClick={() => navigate('kanban')}
                className="text-[10px] font-semibold text-blue-400 hover:underline cursor-pointer"
              >
                Kanban →
              </button>
            </div>

            <div className="space-y-2">
              {activeTasks.map((task) => {
                const isDone = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleLocalTask(task.id)}
                    className="flex items-center gap-3 bg-[#09090b] hover:bg-[#27272a] p-2.5 rounded border border-[#27272a] cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                        isDone
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-blue-500 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p
                        className={`text-xs font-medium truncate ${
                          isDone ? 'line-through opacity-50 text-[#71717a]' : 'text-[#fafafa]'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.priority && (
                        <p className="text-[9px] text-[#71717a] font-mono">
                          {task.domain} • Priority {task.priority}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleAddTaskSubmit} className="mt-3 flex gap-1.5">
            <input
              type="text"
              placeholder="Quick add today's task..."
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-xs font-bold rounded text-[#fafafa] cursor-pointer"
            >
              +
            </button>
          </form>
        </div>

        {/* Row 2 Left: Team Status (col-span-3) */}
        <div className="lg:col-span-3 border border-[#27272a] bg-[#09090b] rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase text-[#71717a]">Team Status</h3>
              <button
                onClick={() => navigate('team')}
                className="text-[10px] text-blue-400 hover:underline cursor-pointer"
              >
                Workspace →
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                    SR
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#fafafa]">Sarah R.</p>
                    <p className="text-[9px] text-green-400">Active now</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#a1a1aa]">80%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    AM
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#fafafa]">Arjun M.</p>
                    <p className="text-[9px] text-[#71717a]">2h ago</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#a1a1aa]">45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                    KP
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#fafafa]">Kevin P.</p>
                    <p className="text-[9px] text-[#71717a]">Idle</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#a1a1aa]">90%</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#27272a]">
            <div className="bg-[#18181b] p-2 rounded text-[10px] italic text-[#a1a1aa]">
              "Backend is integrated with API endpoints. Working on real-time sync."
            </div>
          </div>
        </div>

        {/* Row 2 Middle: Roadmap (col-span-5) */}
        <div className="lg:col-span-5 border border-[#27272a] bg-[#09090b] rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase text-[#71717a]">Roadmap</h3>
              <button
                onClick={() => navigate('timeline')}
                className="text-[10px] text-blue-400 hover:underline cursor-pointer"
              >
                Edit Timeline →
              </button>
            </div>

            <div className="space-y-2 relative pl-2">
              <div className="flex items-center gap-3 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#09090b] shrink-0" />
                <div className="flex-1 bg-[#18181b] p-2 rounded border border-[#27272a] text-[11px] flex justify-between items-center">
                  <span className="text-[#fafafa]">Day 1: Idea & Architecture</span>
                  <span className="text-green-500 font-mono font-bold text-[10px]">Done</span>
                </div>
              </div>

              <div className="flex items-center gap-3 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#09090b] shrink-0" />
                <div className="flex-1 bg-[#18181b] p-2 rounded border border-[#27272a] text-[11px] flex justify-between items-center font-bold">
                  <span className="text-[#fafafa]">Day 2: UI & Frontend Integration</span>
                  <span className="text-blue-400 font-mono text-[10px]">Live</span>
                </div>
              </div>

              <div className="flex items-center gap-3 relative opacity-60">
                <div className="w-2.5 h-2.5 rounded-full bg-[#27272a] border-2 border-[#09090b] shrink-0" />
                <div className="flex-1 bg-[#18181b] p-2 rounded border border-[#27272a] text-[11px] flex justify-between items-center">
                  <span className="text-[#a1a1aa]">Day 3: Pitch Video & Final QA</span>
                  <span className="text-[#71717a] font-mono text-[10px]">Upcoming</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-[#71717a] flex justify-between font-mono">
            <span>Overall Pace: On Schedule</span>
            <span className="text-emerald-400">Milestone 2/3</span>
          </div>
        </div>

        {/* Row 2 Right: AI Idea Spark Widget (col-span-4) */}
        <div className="lg:col-span-4 border border-[#27272a] bg-[#18181b] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-[#71717a] mb-2 flex items-center gap-2">
              <span>🤖</span> AI Idea Spark
            </h3>
            <div className="text-[10px] text-[#a1a1aa] mb-2">
              Suggesting solutions for <span className="text-[#fafafa] font-bold underline">{aiIdea.category}</span>...
            </div>

            <div className="p-2.5 bg-[#09090b] rounded border border-[#27272a] space-y-1.5">
              <p className="text-[11px] font-bold text-purple-400">{aiIdea.title}</p>
              <p className="text-[10px] text-[#71717a] leading-tight">{aiIdea.description}</p>
              <div className="flex gap-1 pt-1 flex-wrap">
                {aiIdea.tech.map((t, idx) => (
                  <span key={idx} className="text-[8px] bg-purple-500/10 text-purple-300 px-1.5 py-0.2 border border-purple-500/20 rounded font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleRegenerateIdea}
            disabled={isGeneratingIdea}
            className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold shadow-[0_0_12px_#9333ea] cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{isGeneratingIdea ? 'Thinking...' : 'Regenerate Idea'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
