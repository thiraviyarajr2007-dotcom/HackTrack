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
  Trash2
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
}) => {
  const role = userRole || currentRole || 'Team Leader';
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotificationsModal(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showNotificationsModal || showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotificationsModal, showUserDropdown]);

  const handleBellClick = () => {
    setShowNotificationsModal(!showNotificationsModal);
    if (onOpenNotifications) onOpenNotifications();
  };

  return (
    <header className="sticky top-0 z-30 h-12 border-b border-[#27272a] flex items-center justify-between px-4 md:px-6 bg-[#09090b] text-[#fafafa] font-sans">
      {/* Global Transparent Overlay Backdrop for Popups */}
      {(showNotificationsModal || showUserDropdown) && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setShowNotificationsModal(false);
            setShowUserDropdown(false);
          }}
        />
      )}

      {/* Mobile Toggle & Header Quick Metrics */}
      <div className="flex items-center gap-4 z-30">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1 text-[#71717a] hover:text-[#fafafa] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider">Active:</span>
            <span className="text-xs font-bold text-[#fafafa]">{activeHackathonsCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider">Completed:</span>
            <span className="text-xs font-bold text-emerald-400">{completedHackathonsCount}</span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">Upcoming:</span>
            <span className="text-xs font-bold text-red-400">{upcomingDeadlinesCount}</span>
          </div>
        </div>
      </div>

      {/* Global Command Palette & Search Bar */}
      <div className="flex items-center gap-2.5">
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 text-[10px] bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-purple-500/40 px-2.5 py-1 rounded-md text-[#a1a1aa] hover:text-[#fafafa] transition-all cursor-pointer group shadow-sm"
            title="Open Command Palette (Ctrl+K or Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">Search or Jump to view...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-[#09090b] border border-[#27272a] text-[9px] font-mono text-purple-400 ml-1">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Role Switcher Selector */}
        <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded px-2 py-0.5 text-xs text-[#fafafa]">
          <UserCheck className="w-3.5 h-3.5 text-blue-400 mr-1.5 hidden xs:block" />
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-xs text-[#fafafa] font-medium border-none focus:outline-none cursor-pointer py-0.5"
          >
            <option value="Team Leader" className="bg-[#18181b] text-white">Team Leader</option>
            <option value="Member" className="bg-[#18181b] text-white">Member</option>
            <option value="Mentor" className="bg-[#18181b] text-white">Mentor</option>
          </select>
        </div>

        {/* Notification Bell */}
        <div className="relative z-50" ref={notificationsRef}>
          <button
            onClick={handleBellClick}
            className="w-7 h-7 flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] rounded cursor-pointer transition-colors"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotificationsModal && (
            <div className="absolute right-0 mt-2 w-80 bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#27272a] mb-2">
                <span className="font-bold text-[#fafafa] uppercase text-[10px] tracking-wider">Notifications</span>
                {onMarkRead && (
                  <button
                    onClick={onMarkRead}
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-[11px] text-[#71717a] py-2 text-center">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded border text-[11px] ${
                        n.read
                          ? 'bg-[#09090b] border-[#27272a] text-[#71717a]'
                          : 'bg-[#09090b] border-blue-500/30 text-[#fafafa]'
                      }`}
                    >
                      <div className="font-semibold text-blue-300">{n.title}</div>
                      <div className="text-[10px] text-[#a1a1aa] mt-0.5">{n.message}</div>
                      <div className="text-[9px] text-[#52525b] mt-1 font-mono">{n.timestamp}</div>
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
                className="flex items-center gap-1.5 p-1 rounded bg-[#18181b] border border-[#27272a] hover:border-blue-500/40 text-xs text-[#fafafa] cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-[#27272a]"
                />
                <span className="font-bold hidden md:inline truncate max-w-[90px]">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-[#71717a]" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-[#27272a] mb-1">
                    <p className="font-bold text-[#fafafa] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#71717a] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 text-[9px] font-mono rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {currentUser.provider} Auth
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (onOpenAuth) onOpenAuth();
                    }}
                    className="w-full text-left p-1.5 rounded hover:bg-[#27272a] text-[#fafafa] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
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
                      className="w-full text-left p-1.5 rounded hover:bg-amber-500/20 text-amber-400 flex items-center gap-2 cursor-pointer"
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
                    className="w-full text-left p-1.5 rounded hover:bg-red-500/20 text-red-400 flex items-center gap-2 cursor-pointer"
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
              className="px-2.5 py-1 text-xs font-bold rounded bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.3)]"
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

