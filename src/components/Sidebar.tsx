import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  Kanban,
  Users,
  Lightbulb,
  FolderArchive,
  Clock,
  PieChart,
  MessageSquare,
  Timer,
  FileText,
  Bookmark,
  DollarSign,
  Award,
  Calendar as CalendarIcon,
  BarChart3,
  Bot,
  Zap,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Presentation,
  FileCode2,
  Mic,
  Scale,
  Github
} from 'lucide-react';

interface SidebarProps {
  currentView?: string;
  activeTab?: string;
  onSelectView?: (view: string) => void;
  onSelectTab?: (tab: string) => void;
  isOpenMobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  currentUser?: any;
  onOpenAuth?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeTab,
  onSelectView,
  onSelectTab,
  isOpenMobile = false,
  collapsed = false,
  onToggleCollapse,
  currentUser,
  onOpenAuth,
}) => {
  const selected = currentView || activeTab || 'dashboard';

  const handleSelect = (id: string) => {
    if (onSelectView) onSelectView(id);
    if (onSelectTab) onSelectTab(id);
  };

  const menuGroups = [
    {
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '📊' },
        { id: 'hackathon-board', label: 'Hackathon Board', icon: Trophy, emoji: '📋', badge: 'Active' },
        { id: 'kanban', label: 'Kanban Board', icon: Kanban, emoji: '🗂️' },
        { id: 'github-sync', label: 'GitHub Commit Sync', icon: Github, emoji: '🐙', badge: 'Live' },
        { id: 'team', label: 'Team Workspace', icon: Users, emoji: '👥' },
        { id: 'document-center', label: 'Doc Center', icon: FolderArchive, emoji: '📁' },
      ],
    },
    {
      title: 'AI Generator & Tools',
      items: [
        { id: 'ai-idea', label: 'AI Idea Spark', icon: Lightbulb, emoji: '✨', highlight: true },
        { id: 'ai-ppt', label: 'AI Slide Deck', icon: Presentation, emoji: '📽️' },
        { id: 'ai-readme', label: 'AI README Engine', icon: FileCode2, emoji: '📝' },
        { id: 'ai-pitch', label: 'AI Pitch Deck', icon: Mic, emoji: '🎙️' },
        { id: 'ai-eval', label: 'AI Score Evaluator', icon: Scale, emoji: '⚖️' },
        { id: 'ai-judge', label: 'AI Judge Simulator', icon: UserCheck, emoji: '🤖' },
        { id: 'ai-reviewer', label: 'Code Reviewer', icon: ShieldCheck, emoji: '🛡️' },
      ],
    },
    {
      title: 'Planning & Ops',
      items: [
        { id: 'timeline', label: 'Roadmap & Timeline', icon: Clock, emoji: '🗺️' },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon, emoji: '📅' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, emoji: '📈' },
        { id: 'expenses', label: 'Expenses', icon: DollarSign, emoji: '💰' },
        { id: 'progress-ring', label: 'Progress Rings', icon: PieChart, emoji: '⭕' },
        { id: 'standups', label: 'Daily Standups', icon: MessageSquare, emoji: '💬' },
        { id: 'deadlines', label: 'Deadlines', icon: Timer, emoji: '⏱️', badge: 'Urgent' },
        { id: 'notes', label: 'Notes & Q&A', icon: FileText, emoji: '📄' },
        { id: 'resources', label: 'Resource Library', icon: Bookmark, emoji: '📚' },
        { id: 'achievements', label: 'Achievements', icon: Award, emoji: '🏆' },
      ],
    },
  ];

  return (
    <aside
      className={`fixed md:relative top-0 bottom-0 left-0 z-40 flex flex-col w-56 bg-[#09090b] border-r border-[#27272a] text-[#fafafa] font-sans transition-transform duration-200 ease-in-out ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="h-12 px-4 border-b border-[#27272a] flex items-center justify-between bg-[#09090b]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs italic text-white shadow-[0_0_8px_rgba(37,99,235,0.4)]">
            H
          </div>
          <span className="font-bold tracking-tight text-sm text-[#fafafa]">
            HackTrack
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            v2.4
          </span>
        </div>

        {/* Mobile close button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="md:hidden text-[#71717a] hover:text-[#fafafa]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-3">
            <div className="text-[10px] uppercase font-semibold text-[#52525b] px-3 py-1.5 mt-2 tracking-wider">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = selected === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`relative w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#18181b] text-blue-400 font-semibold'
                        : item.highlight
                        ? 'hover:bg-[#18181b] text-purple-300 hover:text-purple-200'
                        : 'hover:bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa]'
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-r-full" />
                    )}

                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-sm leading-none">{item.emoji}</span>
                      <span className="truncate text-[12px]">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          item.badge === 'Urgent'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-[#27272a] text-[#a1a1aa]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div
        onClick={onOpenAuth}
        className="p-3 border-t border-[#27272a] bg-[#18181b] hover:bg-[#27272a]/80 transition-all cursor-pointer group"
        title="Click to view profile or switch account"
      >
        <div className="flex items-center gap-2 mb-2">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name || 'User Avatar'}
              className="w-7 h-7 rounded-full object-cover border border-[#3f3f46] group-hover:border-blue-500 transition-colors"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 text-[10px] flex items-center justify-center font-bold text-white shadow-sm">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'HT'}
            </div>
          )}
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-[#fafafa] truncate group-hover:text-blue-400 transition-colors">
              {currentUser?.name || 'Sabankumar'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#a1a1aa] truncate">{currentUser?.role || 'Team Leader'}</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentUser?.provider || 'Google'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[9px] text-[#a1a1aa]">
            <span>Workspace Sync</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="w-full h-1 bg-[#27272a] rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald-500 rounded-full shadow-[0_0_8px_#22c55e]" />
          </div>
        </div>
      </div>
    </aside>
  );
};
