import React from 'react';
import { motion } from 'motion/react';
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
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Presentation,
  FileCode2,
  Mic,
  Scale,
  Github,
  CheckSquare,
  Plus,
  Sparkles,
  Layers
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
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'hackathon-board', label: 'Hackathons', icon: Trophy, badge: 'Active' },
        { id: 'kanban', label: 'Kanban Board', icon: Kanban },
        { id: 'google-tasks', label: 'Google Tasks', icon: CheckSquare, badge: 'OAuth' },
        { id: 'github-sync', label: 'GitHub Commits', icon: Github, badge: 'Sync' },
        { id: 'team', label: 'Team Space', icon: Users },
        { id: 'document-center', label: 'Doc Center', icon: FolderArchive },
      ],
    },
    {
      title: 'AI Suite',
      items: [
        { id: 'ai-idea', label: 'AI Idea Spark', icon: Lightbulb, highlight: true },
        { id: 'ai-ppt', label: 'AI Slide Deck', icon: Presentation },
        { id: 'ai-readme', label: 'AI README Engine', icon: FileCode2 },
        { id: 'ai-pitch', label: 'AI Pitch Deck', icon: Mic },
        { id: 'ai-eval', label: 'AI Score Evaluator', icon: Scale },
        { id: 'ai-judge', label: 'AI Judge Simulator', icon: UserCheck },
        { id: 'ai-reviewer', label: 'Code Audit AI', icon: ShieldCheck },
      ],
    },
    {
      title: 'Planning & Ops',
      items: [
        { id: 'timeline', label: 'Roadmap & Timeline', icon: Clock },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'expenses', label: 'Expenses', icon: DollarSign },
        { id: 'progress-ring', label: 'Progress Metrics', icon: PieChart },
        { id: 'standups', label: 'Daily Standups', icon: MessageSquare },
        { id: 'deadlines', label: 'Deadlines', icon: Timer, badge: 'Urgent' },
        { id: 'notes', label: 'Notes & Specs', icon: FileText },
        { id: 'resources', label: 'Resource Vault', icon: Bookmark },
        { id: 'achievements', label: 'Achievements', icon: Award },
      ],
    },
  ];

  return (
    <aside
      className={`fixed md:relative top-0 bottom-0 left-0 z-40 flex flex-col glass-panel border-r border-slate-800/80 bg-[#0b0f17]/95 text-slate-100 font-sans transition-all duration-300 ease-in-out ${
        isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
      } ${collapsed ? 'md:w-16' : 'md:w-60'}`}
    >
      {/* Brand Header */}
      <div className="h-14 px-3.5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-indigo-500/25 shrink-0">
            H
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span className="font-heading font-bold tracking-tight text-sm text-white truncate">
                HackTrack
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                PRO
              </span>
            </motion.div>
          )}
        </div>

        {/* Collapse Toggle / Mobile Close */}
        <div className="flex items-center gap-1">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 hidden md:block" />}
              <X className="w-4 h-4 md:hidden" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-4 custom-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed ? (
              <div className="text-[10px] font-mono font-semibold uppercase text-slate-500 px-2 py-1 tracking-wider">
                {group.title}
              </div>
            ) : (
              <div className="h-2" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = selected === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`relative w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 border border-indigo-500/30 text-indigo-300 font-semibold shadow-sm'
                        : item.highlight
                        ? 'hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 border border-transparent'
                        : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-100 border border-transparent'
                    }`}
                  >
                    {/* Active Left Indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="activeSideBarNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_8px_#6366f1]"
                      />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-indigo-400'
                            : item.highlight
                            ? 'text-purple-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      {!collapsed && (
                        <span className="truncate font-medium text-[12px]">{item.label}</span>
                      )}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          item.badge === 'Urgent'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : item.badge === 'OAuth' || item.badge === 'Sync'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/50'
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
        className="p-3 border-t border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/80 transition-all cursor-pointer group"
        title="Account & Workspace Settings"
      >
        <div className="flex items-center gap-2.5">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name || 'User Avatar'}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'HT'}
            </div>
          )}

          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                {currentUser?.name || 'Sabankumar'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-slate-400 truncate">{currentUser?.role || 'Team Leader'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

