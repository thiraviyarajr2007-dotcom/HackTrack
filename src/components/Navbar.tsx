import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  UserCheck,
  Sparkles,
  Menu,
  Check,
  X,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Trash2,
  Plus,
  Building2,
  FolderPlus,
  Trophy,
  Kanban
} from 'lucide-react';
import { UserRole, NotificationItem, UserProfile } from '../types';

interface NavbarProps {
  userRole?: UserRole;
  currentRole?: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications?: NotificationItem[];
  onMarkRead?: () => void;
  onOpenNotifications?: () => void;
  onToggleMobileSidebar?: () => void;
  onNavigateToAI?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  activeTab?: string;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onClearWorkspace?: () => void;
  activeHackathonsCount?: number;
  completedHackathonsCount?: number;
  upcomingDeadlinesCount?: number;
  onOpenCommandPalette?: () => void;
  onQuickCreate?: (type: 'hackathon' | 'task' | 'document') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  currentRole,
  onRoleChange,
  notifications = [],
  onMarkRead,
  onOpenNotifications,
  onToggleMobileSidebar,
  onNavigateToAI,
  searchQuery = '',
  setSearchQuery,
  activeTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onClearWorkspace,
  activeHackathonsCount = 0,
  completedHackathonsCount = 0,
  upcomingDeadlinesCount = 0,
  onOpenCommandPalette,
  onQuickCreate,
}) => {
  const role = userRole || currentRole || 'Team Leader';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showQuickCreateDropdown, setShowQuickCreateDropdown] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('Nexciti Hackathon HQ');

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const quickCreateRef = useRef<HTMLDivElement>(null);

  // Close dropdown popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setShowNotificationsModal(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target)
      ) {
        setShowUserDropdown(false);
      }
      if (
        workspaceRef.current &&
        !workspaceRef.current.contains(target)
      ) {
        setShowWorkspaceDropdown(false);
      }
      if (
        quickCreateRef.current &&
        !quickCreateRef.current.contains(target)
      ) {
        setShowQuickCreateDropdown(false);
      }
    };

    if (showNotificationsModal || showUserDropdown || showWorkspaceDropdown || showQuickCreateDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotificationsModal, showUserDropdown, showWorkspaceDropdown, showQuickCreateDropdown]);

  const handleBellClick = () => {
    setShowNotificationsModal(!showNotificationsModal);
    if (onOpenNotifications) onOpenNotifications();
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-slate-800/80 flex items-center justify-between px-4 md:px-6 bg-[#0b0f17]/80 backdrop-blur-md text-slate-100 font-sans">
      {/* Global Transparent Overlay Backdrop for Popups */}
      {(showNotificationsModal || showUserDropdown || showWorkspaceDropdown || showQuickCreateDropdown) && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setShowNotificationsModal(false);
            setShowUserDropdown(false);
            setShowWorkspaceDropdown(false);
            setShowQuickCreateDropdown(false);
          }}
        />
      )}

      {/* Left: Mobile Toggle & Workspace Switcher */}
      <div className="flex items-center gap-3 z-30">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Workspace Switcher */}
        <div className="relative z-50" ref={workspaceRef}>
          <button
            type="button"
            aria-expanded={showWorkspaceDropdown}
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              showWorkspaceDropdown
                ? 'bg-slate-800/90 border-indigo-500/60 text-indigo-200 shadow-indigo-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-heading truncate max-w-[100px] xs:max-w-[130px] sm:max-w-[160px]">
              {activeWorkspace}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${
                showWorkspaceDropdown ? 'rotate-180 text-indigo-400' : ''
              }`}
            />
          </button>

          {showWorkspaceDropdown && (
            <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Workspaces
              </div>
              {['Nexciti Hackathon HQ', 'AI Innovation Lab', 'SaaS Incubator'].map((ws) => (
                <button
                  key={ws}
                  type="button"
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setShowWorkspaceDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    activeWorkspace === ws
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                      : 'hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <span className="truncate">{ws}</span>
                  {activeWorkspace === ws && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header Metrics */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono ml-2 border-l border-slate-800 pl-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Active:</span>
            <span className="text-xs font-bold text-slate-200">{activeHackathonsCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Done:</span>
            <span className="text-xs font-bold text-emerald-400">{completedHackathonsCount}</span>
          </div>
        </div>
      </div>

      {/* Center: Command Palette Search Bar */}
      <div className="flex items-center gap-3">
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 text-xs bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer group shadow-inner"
            title="Open Command Palette (Ctrl+K or Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium text-[11px]">Search commands, files or tools...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-indigo-400 ml-1">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right Actions: Quick Create, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Create Button */}
        <div className="relative z-50" ref={quickCreateRef}>
          <button
            type="button"
            aria-expanded={showQuickCreateDropdown}
            onClick={() => setShowQuickCreateDropdown(!showQuickCreateDropdown)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer ${
              showQuickCreateDropdown
                ? 'bg-indigo-500 ring-2 ring-indigo-400/50 shadow-indigo-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500'
            }`}
          >
            <Plus className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 ${showQuickCreateDropdown ? 'rotate-45' : ''}`} />
            <span className="hidden sm:inline">Create</span>
          </button>

          {showQuickCreateDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  if (onQuickCreate) onQuickCreate('hackathon');
                  setShowQuickCreateDropdown(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Trophy className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>New Hackathon</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onQuickCreate) onQuickCreate('task');
                  setShowQuickCreateDropdown(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Kanban className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span>New Kanban Task</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onQuickCreate) onQuickCreate('document');
                  setShowQuickCreateDropdown(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Upload Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Role Selector */}
        <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-200">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-xs text-slate-200 font-medium border-none focus:outline-none cursor-pointer py-0.5"
          >
            <option value="Team Leader" className="bg-slate-900 text-white">Team Leader</option>
            <option value="Member" className="bg-slate-900 text-white">Member</option>
            <option value="Mentor" className="bg-slate-900 text-white">Mentor</option>
          </select>
        </div>

        {/* Notification Bell */}
        <div className="relative z-50" ref={notificationsRef}>
          <button
            onClick={handleBellClick}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white border border-slate-800 bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotificationsModal && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-white uppercase text-[10px] font-mono tracking-wider">
                  Notifications
                </span>
                {onMarkRead && (
                  <button
                    onClick={onMarkRead}
                    className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 space-y-1">
                    <Bell className="w-6 h-6 mx-auto text-slate-700" />
                    <p className="text-[11px]">All caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-[11px] transition-all ${
                        n.read
                          ? 'bg-slate-950/60 border-slate-800/60 text-slate-400'
                          : 'bg-indigo-950/30 border-indigo-500/30 text-slate-100'
                      }`}
                    >
                      <div className="font-semibold text-indigo-300">{n.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{n.message}</div>
                      <div className="text-[9px] text-slate-500 mt-1 font-mono">{n.timestamp}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Auth Dropdown */}
        <div className="relative z-50" ref={userDropdownRef}>
          {currentUser ? (
            <div>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-200 cursor-pointer transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-700"
                />
                <span className="font-bold hidden md:inline truncate max-w-[90px]">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
                  <div className="p-2 border-b border-slate-800 mb-1">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-mono rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {currentUser.provider} Auth
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (onOpenAuth) onOpenAuth();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Switch Account</span>
                  </button>

                  {onClearWorkspace && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (window.confirm('Are you sure you want to delete all sample / model data and start with an empty workspace?')) {
                          onClearWorkspace();
                        }
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-amber-500/10 text-amber-400 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Delete Model Data</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-red-500/10 text-red-400 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


