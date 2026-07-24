import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
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
  RotateCcw,
  Presentation,
  Flame,
  ArrowRight,
  ShieldCheck,
  Award,
  Kanban,
  RefreshCw,
  Loader2,
  Target
} from 'lucide-react';
import {
  HackathonItem,
  TaskItem,
  DeadlineTimer,
  DailyStandupItem,
  KanbanStatus,
} from '../types';
import { getAccessToken, signInWithGoogle } from '../lib/firebase';

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

  // Google Tasks Daily Goals State & Integration
  interface GoalItem {
    id: string;
    title: string;
    completed: boolean;
    source: 'google' | 'local';
    dueDate?: string;
  }

  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [isFetchingGoals, setIsFetchingGoals] = useState<boolean>(false);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const [dailyGoals, setDailyGoals] = useState<GoalItem[]>([
    {
      id: 'dg-1',
      title: 'Complete System Architecture & OAuth Setup',
      completed: true,
      source: 'local',
    },
    {
      id: 'dg-2',
      title: 'Finalize Pitch Slide Deck & Demo Highlights',
      completed: false,
      source: 'local',
    },
    {
      id: 'dg-3',
      title: 'Submit Project Code Entry to Judge Portal',
      completed: false,
      source: 'local',
    },
  ]);

  // Load live Google Tasks if OAuth token available
  const loadGoogleTasks = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setIsGoogleConnected(false);
        return;
      }
      setGoogleAccessToken(token);
      setIsGoogleConnected(true);
      setIsFetchingGoals(true);

      const res = await fetch(
        'https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=true&showHidden=true',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          setIsGoogleConnected(false);
          setGoogleAccessToken(null);
        }
        return;
      }

      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        const fetchedGoals: GoalItem[] = data.items.slice(0, 5).map((gt: any) => ({
          id: gt.id,
          title: gt.title || 'Untitled Goal',
          completed: gt.status === 'completed',
          source: 'google',
          dueDate: gt.due ? new Date(gt.due).toLocaleDateString() : undefined,
        }));

        if (fetchedGoals.length > 0) {
          setDailyGoals(fetchedGoals);
        }
      }
    } catch (err) {
      console.error('Error fetching Google Tasks for Daily Goals widget:', err);
    } finally {
      setIsFetchingGoals(false);
    }
  }, []);

  useEffect(() => {
    loadGoogleTasks();
  }, [loadGoogleTasks]);

  const handleConnectGoogle = async () => {
    setIsFetchingGoals(true);
    const { accessToken: token, error } = await signInWithGoogle();
    if (token) {
      setGoogleAccessToken(token);
      setIsGoogleConnected(true);
      await loadGoogleTasks();
    } else {
      console.warn('Google Connect error or dismissed:', error);
    }
    setIsFetchingGoals(false);
  };

  const handleToggleGoal = async (goal: GoalItem) => {
    const nextCompleted = !goal.completed;

    // Optimistic UI update
    setDailyGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, completed: nextCompleted } : g))
    );

    if (goal.source === 'google' && googleAccessToken) {
      try {
        await fetch(
          `https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${encodeURIComponent(goal.id)}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: nextCompleted ? 'completed' : 'needsAction',
            }),
          }
        );
      } catch (err) {
        console.error('Error toggling Google Task:', err);
        // Revert on error
        setDailyGoals((prev) =>
          prev.map((g) => (g.id === goal.id ? { ...g, completed: goal.completed } : g))
        );
      }
    } else {
      // Check if matching Kanban task exists
      const match = tasks.find((t) => t.id === goal.id || t.title === goal.title);
      if (match && onUpdateTaskStatus) {
        onUpdateTaskStatus(match.id, nextCompleted ? 'Completed' : 'In Progress');
      }
    }
  };

  const handleAddGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    const title = newGoalInput.trim();
    setNewGoalInput('');

    if (isGoogleConnected && googleAccessToken) {
      setIsAddingGoal(true);
      try {
        const res = await fetch(
          'https://tasks.googleapis.com/tasks/v1/lists/@default/tasks',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
          }
        );
        if (res.ok) {
          const newGt = await res.json();
          const newGoal: GoalItem = {
            id: newGt.id,
            title: newGt.title,
            completed: false,
            source: 'google',
          };
          setDailyGoals((prev) => [newGoal, ...prev]);
        }
      } catch (err) {
        console.error('Failed to add goal to Google Tasks:', err);
      } finally {
        setIsAddingGoal(false);
      }
    } else {
      const newGoal: GoalItem = {
        id: `dg_${Date.now()}`,
        title,
        completed: false,
        source: 'local',
      };
      setDailyGoals((prev) => [newGoal, ...prev]);
      if (onAddTask) {
        onAddTask(title);
      }
    }
  };

  const top3Goals = dailyGoals.slice(0, 3);
  const completedGoalCount = top3Goals.filter((g) => g.completed).length;

  // Real task metrics and state derived directly from workspace props
  const totalTaskCount = tasks.length;
  const completedTaskCount = tasks.filter((t) => t.status === 'Completed').length;
  const taskProgressPct =
    totalTaskCount > 0
      ? Math.round((completedTaskCount / totalTaskCount) * 100)
      : hackathons[0]?.progress || 0;

  const activeDeadline = deadlines[0];

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

  const handleToggleTaskItem = (task: TaskItem) => {
    if (onUpdateTaskStatus) {
      const nextStatus: KanbanStatus =
        task.status === 'Completed' ? 'In Progress' : 'Completed';
      onUpdateTaskStatus(task.id, nextStatus);
    } else if (onToggleTask) {
      onToggleTask(task.id);
    }
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    if (onAddTask) onAddTask(newTaskInput.trim());
    setNewTaskInput('');
  };

  const activeHackathon = hackathons[0] || {
    name: 'Nexciti AI Global Hackathon 2026',
    organizer: 'Nexciti Labs',
    status: 'In Progress',
    prizePool: '$25,000 Pool',
    progress: 68,
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      {/* Top Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[24px] p-6 md:p-8 relative overflow-hidden border border-slate-800/80 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/30"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Hackathon Active • Sprint Day 2</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-white">
              Welcome back, {userName} 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
              You have <span className="text-indigo-300 font-semibold">{tasks.filter(t => t.status !== 'Completed').length} active tasks</span> remaining for <span className="text-white font-semibold">{activeHackathon.name}</span>. Submissions close in 18 hours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('ai-ppt')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer group"
            >
              <Presentation className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
              <span>AI Slide Deck</span>
            </button>
            <button
              onClick={() => navigate('kanban')}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Kanban className="w-4 h-4 text-indigo-400" />
              <span>Kanban Board</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('hackathon-board')}
          className="glass-card rounded-[20px] p-4 border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Active Hackathons</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Trophy className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-mono font-bold text-white">{hackathons.length}</span>
            <span className="text-xs text-indigo-400 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('achievements')}
          className="glass-card rounded-[20px] p-4 border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Completed</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-mono font-bold text-white">
              {hackathons.filter((h) => h.status === 'Won' || h.status === 'Submitted').length}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Track Record</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('deadlines')}
          className="glass-card rounded-[20px] p-4 border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-red-400 font-medium uppercase tracking-wider">Deadlines</span>
            <div className="w-7 h-7 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-mono font-bold text-red-400">{deadlines.length}</span>
            <span className="text-xs text-red-400 font-mono font-semibold">Timers Active</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('kanban')}
          className="glass-card rounded-[20px] p-4 border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Kanban Tasks</span>
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-mono font-bold text-white">{tasks.length}</span>
            <span className="text-xs text-purple-400 font-semibold">Live Board</span>
          </div>
        </motion.div>
      </div>

      {/* Fresh User Empty Workspace Banner if 0 Hackathons */}
      {hackathons.length === 0 && (
        <div className="glass-card rounded-[24px] p-8 text-center space-y-4 border border-slate-800 bg-slate-900/80 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-semibold mb-1">
              <span>No Hackathons Found</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-white">
              Create Your First Hackathon Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Start building your custom project workspace to manage team members, Kanban tasks, deadlines, and AI pitch generators.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onCreateHackathon) onCreateHackathon();
                else navigate('hackathon-board');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Hackathon</span>
            </button>

            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Load Demo Sample Data</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* High Density Main Grid (Matching Spec Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Row 1 Left: Active Hackathon Challenge Spotlight (col-span-7) */}
        <div className="lg:col-span-7 glass-card rounded-[24px] p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-heading font-bold text-white">
                  {activeHackathon.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-semibold">
                  {activeHackathon.status || 'Building'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Organizer: <span className="text-slate-200 font-semibold">{activeHackathon.organizer || 'Nexciti Labs'}</span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold px-3 py-1 rounded-xl border border-indigo-500/20">
                {activeHackathon.prizePool || '$25,000 Prize'}
              </span>
              <button
                onClick={() => navigate('hackathon-board')}
                className="bg-slate-800/80 hover:bg-slate-700/80 text-xs px-3 py-1 border border-slate-700/80 rounded-xl cursor-pointer flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <span>Details</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {/* Box 1: Circular Progress Ring */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-[18px] p-4 flex flex-col justify-between">
              <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">Project Progress</p>
              <div className="relative flex-1 flex items-center justify-center my-3">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="#6366f1"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="238"
                    strokeDashoffset={238 - (238 * taskProgressPct) / 100}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_#6366f1]"
                    initial={{ strokeDashoffset: 238 }}
                    animate={{ strokeDashoffset: 238 - (238 * taskProgressPct) / 100 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-mono font-black text-white">{taskProgressPct}%</span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold font-mono">Completed</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 text-center font-mono">
                Tasks: <span className="text-indigo-300 font-bold">{completedTaskCount}</span>/{totalTaskCount} Done
              </div>
            </div>

            {/* Box 2: Deadline Countdown */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-[18px] p-4 flex flex-col justify-between">
              <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">Submission Countdown</p>
              <div className="space-y-2 my-2">
                <div className="flex flex-col">
                  <span className="text-xs text-red-400 font-semibold truncate">
                    {activeDeadline ? activeDeadline.title : 'Final Code Freeze'}
                  </span>
                  <span className="text-lg font-mono font-black text-red-400">
                    {activeDeadline ? activeDeadline.targetTime : '18h 42m 10s'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[75%] h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full shadow-[0_0_8px_#ef4444]" />
                </div>
              </div>
              <button
                onClick={() => navigate('deadlines')}
                className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline text-left font-semibold cursor-pointer flex items-center gap-1"
              >
                <span>View Timers</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Box 3: Quick Resources & Submission Action */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-[18px] p-4 flex flex-col justify-between">
              <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">Quick Actions</p>
              <div className="space-y-1.5 my-2">
                <button
                  onClick={() => navigate('github-sync')}
                  className="w-full text-xs flex justify-between items-center p-2 bg-slate-900/80 hover:bg-slate-800 rounded-xl text-slate-200 transition-colors cursor-pointer border border-slate-800"
                >
                  <span className="flex items-center gap-2"><Github className="w-3.5 h-3.5 text-indigo-400" /> GitHub Commits</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => navigate('document-center')}
                  className="w-full text-xs flex justify-between items-center p-2 bg-slate-900/80 hover:bg-slate-800 rounded-xl text-slate-200 transition-colors cursor-pointer border border-slate-800"
                >
                  <span className="flex items-center gap-2"><Folder className="w-3.5 h-3.5 text-purple-400" /> Doc Center</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <button
                onClick={() => navigate('document-center')}
                className="mt-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-center py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
              >
                Submit Hackathon Entry
              </button>
            </div>
          </div>
        </div>

        {/* Row 1 Right: Daily Goals Widget (Google Tasks Integration) (col-span-5) */}
        <div className="lg:col-span-5 glass-card rounded-[24px] p-6 border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-white flex items-center gap-1.5">
                    <span>Daily Goals</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Top 3
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Google Tasks Integration</p>
                </div>
              </div>

              {isGoogleConnected ? (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Google Tasks
                  </span>
                  <button
                    onClick={loadGoogleTasks}
                    disabled={isFetchingGoals}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Refresh Google Tasks"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingGoals ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  disabled={isFetchingGoals}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition-all cursor-pointer"
                >
                  {isFetchingGoals ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <CheckSquare className="w-3 h-3 text-indigo-400" />
                  )}
                  <span>Connect Google</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl mb-4 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Today's Priorities Progress</span>
                <span className="font-mono font-bold text-indigo-400">
                  {completedGoalCount}/{top3Goals.length} Completed
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${top3Goals.length > 0 ? (completedGoalCount / top3Goals.length) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {completedGoalCount === top3Goals.length && top3Goals.length > 0 && (
                <p className="text-[10px] text-emerald-400 font-semibold text-center pt-0.5">
                  🎉 All top 3 daily priorities completed for today!
                </p>
              )}
            </div>

            {/* Top 3 Priorities List */}
            <div className="space-y-2.5">
              {top3Goals.map((goal, idx) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ x: 2 }}
                  onClick={() => handleToggleGoal(goal)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    goal.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                      : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs shrink-0 transition-colors ${
                        goal.completed
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-700 bg-slate-900 hover:border-indigo-500 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-400">#{idx + 1}</span>
                        <p
                          className={`text-xs font-semibold truncate ${
                            goal.completed ? 'line-through text-slate-500' : 'text-slate-100'
                          }`}
                        >
                          {goal.title}
                        </p>
                      </div>
                      {goal.dueDate && (
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">Due: {goal.dueDate}</p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                      goal.source === 'google'
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {goal.source === 'google' ? 'Google Task' : 'Goal'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Add Goal Input */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
            <form onSubmit={handleAddGoalSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder={
                  isGoogleConnected
                    ? '+ Add goal to Google Tasks...'
                    : '+ Add daily priority goal...'
                }
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isAddingGoal || !newGoalInput.trim()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold rounded-xl text-white cursor-pointer transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1"
              >
                {isAddingGoal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>
                {isGoogleConnected ? 'Synced live with Google Tasks' : 'Connect Google Tasks for cloud sync'}
              </span>
              <button
                type="button"
                onClick={() => navigate('google-tasks')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1"
              >
                <span>Full Google Tasks</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 1 Right: Today's Tasks (col-span-4) */}
        <div className="lg:col-span-4 glass-card rounded-[24px] p-6 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                Kanban Quick Tasks ({tasks.length})
              </h3>
              <button
                onClick={() => navigate('kanban')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Board →
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task) => {
                  const isDone = task.status === 'Completed';
                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ x: 2 }}
                      onClick={() => handleToggleTaskItem(task)}
                      className="flex items-center gap-3 bg-slate-950/60 hover:bg-slate-800/60 p-3 rounded-xl border border-slate-800/80 cursor-pointer transition-all"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                          isDone
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-700 text-transparent hover:border-indigo-500'
                        }`}
                      >
                        ✓
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p
                          className={`text-xs font-medium truncate ${
                            isDone ? 'line-through opacity-50 text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.priority && (
                          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                            Priority: {task.priority}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-6 border border-dashed border-slate-800 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-slate-500">No active tasks in board.</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleAddTaskSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="+ Quick add task..."
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl text-white cursor-pointer transition-all shadow-md shadow-indigo-600/20"
            >
              Add
            </button>
          </form>
        </div>

        {/* Row 2 Left: Team Status (col-span-3) */}
        <div className="lg:col-span-3 glass-card rounded-[24px] p-5 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">Team Active</h3>
              <button
                onClick={() => navigate('team')}
                className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Team Space →
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    SR
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Sarah R.</p>
                    <p className="text-[10px] text-emerald-400 font-mono">Frontend Dev • Active</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    AM
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Arjun M.</p>
                    <p className="text-[10px] text-slate-400 font-mono">Backend • 2h ago</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    KP
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Kevin P.</p>
                    <p className="text-[10px] text-slate-400 font-mono">AI Architect • Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] italic text-slate-400">
              "Backend API endpoints integrated. Testing real-time sync with Firebase."
            </div>
          </div>
        </div>

        {/* Row 2 Middle: Roadmap (col-span-5) */}
        <div className="lg:col-span-5 glass-card rounded-[24px] p-5 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">Sprint Roadmap</h3>
              <button
                onClick={() => navigate('timeline')}
                className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Roadmap →
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] shrink-0" />
                <div className="flex-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <span className="text-slate-200 font-medium">Day 1: System Architecture & Auth</span>
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">Completed</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] shrink-0 animate-pulse" />
                <div className="flex-1 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/30 text-xs flex justify-between items-center">
                  <span className="text-white font-semibold">Day 2: UI Redesign & OAuth Integration</span>
                  <span className="text-indigo-400 font-mono font-bold text-[10px]">In Progress</span>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-60">
                <div className="w-3 h-3 rounded-full bg-slate-700 shrink-0" />
                <div className="flex-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <span className="text-slate-400">Day 3: Pitch Video & Final QA</span>
                  <span className="text-slate-500 font-mono text-[10px]">Upcoming</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between font-mono">
            <span>Overall Pace: <span className="text-emerald-400 font-bold">On Schedule</span></span>
            <span className="text-indigo-400 font-bold">Milestone 2/3</span>
          </div>
        </div>

        {/* Row 2 Right: AI Idea Spark Widget (col-span-4) */}
        <div className="lg:col-span-4 glass-card rounded-[24px] p-5 border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Idea Generator</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Gemini AI
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-purple-300">{aiIdea.title}</p>
                <span className="text-[9px] font-mono text-slate-400">{aiIdea.category}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{aiIdea.description}</p>
              <div className="flex gap-1.5 pt-1 flex-wrap">
                {aiIdea.tech.map((t, idx) => (
                  <span key={idx} className="text-[9px] bg-purple-500/10 text-purple-300 px-2 py-0.5 border border-purple-500/20 rounded-full font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleRegenerateIdea}
            disabled={isGeneratingIdea}
            className="w-full mt-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/20 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{isGeneratingIdea ? 'Generating Idea...' : 'Spark Next Idea'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

