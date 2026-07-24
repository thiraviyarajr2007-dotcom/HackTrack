import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  Trophy,
  Kanban,
  Github,
  Users,
  FolderArchive,
  Clock,
  Calendar as CalendarIcon,
  BarChart3,
  FileText,
  BookOpen,
  DollarSign,
  Award,
  MessageSquare,
  Sparkles,
  X,
  ArrowRight,
  Plus,
  CheckSquare
} from 'lucide-react';

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string) => void;
  onOpenNewTaskModal?: () => void;
  onOpenNewHackathonModal?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Views' | 'Quick Actions';
  icon: React.FC<{ className?: string }>;
  hotkey?: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenNewTaskModal,
  onOpenNewHackathonModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      category: 'Views',
      icon: LayoutDashboard,
      hotkey: '⌘1',
      action: () => onNavigate('dashboard'),
    },
    {
      id: 'hackathon-board',
      title: 'Go to Hackathon Board',
      category: 'Views',
      icon: Trophy,
      hotkey: '⌘2',
      action: () => onNavigate('hackathon-board'),
    },
    {
      id: 'kanban',
      title: 'Go to Kanban Board',
      category: 'Views',
      icon: Kanban,
      hotkey: '⌘3',
      action: () => onNavigate('kanban'),
    },
    {
      id: 'google-tasks',
      title: 'Go to Google Tasks Sync',
      category: 'Views',
      icon: CheckSquare,
      action: () => onNavigate('google-tasks'),
    },
    {
      id: 'github-sync',
      title: 'Go to GitHub Commit Sync',
      category: 'Views',
      icon: Github,
      hotkey: '⌘4',
      action: () => onNavigate('github-sync'),
    },
    {
      id: 'timeline',
      title: 'Go to Project Timeline',
      category: 'Views',
      icon: Clock,
      hotkey: '⌘5',
      action: () => onNavigate('timeline'),
    },
    {
      id: 'team',
      title: 'Go to Team Workspace',
      category: 'Views',
      icon: Users,
      action: () => onNavigate('team'),
    },
    {
      id: 'calendar',
      title: 'Go to Calendar & Schedules',
      category: 'Views',
      icon: CalendarIcon,
      action: () => onNavigate('calendar'),
    },
    {
      id: 'analytics',
      title: 'Go to Team Analytics',
      category: 'Views',
      icon: BarChart3,
      action: () => onNavigate('analytics'),
    },
    {
      id: 'document-center',
      title: 'Go to Document Center',
      category: 'Views',
      icon: FolderArchive,
      action: () => onNavigate('document-center'),
    },
    {
      id: 'notes',
      title: 'Go to Notes & Ideas',
      category: 'Views',
      icon: FileText,
      action: () => onNavigate('notes'),
    },
    {
      id: 'resources',
      title: 'Go to Resource Library',
      category: 'Views',
      icon: BookOpen,
      action: () => onNavigate('resources'),
    },
    {
      id: 'expense',
      title: 'Go to Expense Tracker',
      category: 'Views',
      icon: DollarSign,
      action: () => onNavigate('expense'),
    },
    {
      id: 'achievements',
      title: 'Go to Achievements & Badges',
      category: 'Views',
      icon: Award,
      action: () => onNavigate('achievements'),
    },
    {
      id: 'standup',
      title: 'Go to Daily Standups',
      category: 'Views',
      icon: MessageSquare,
      action: () => onNavigate('standup'),
    },
  ];

  if (onOpenNewTaskModal) {
    commandItems.unshift({
      id: 'action-new-task',
      title: 'Create New Kanban Task',
      category: 'Quick Actions',
      icon: Plus,
      hotkey: '⌘N',
      action: () => {
        onNavigate('kanban');
        onOpenNewTaskModal();
      },
    });
  }

  if (onOpenNewHackathonModal) {
    commandItems.unshift({
      id: 'action-new-hackathon',
      title: 'Add New Hackathon',
      category: 'Quick Actions',
      icon: Trophy,
      hotkey: '⌘H',
      action: () => {
        onNavigate('hackathon-board');
        onOpenNewHackathonModal();
      },
    });
  }

  const filteredItems = commandItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden font-sans text-xs flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#27272a] bg-[#09090b]">
          <Search className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search view (e.g. Kanban, Timeline, Dashboard)..."
            className="w-full bg-transparent text-[#fafafa] placeholder-[#71717a] text-xs focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-[#71717a] space-y-1">
              <Sparkles className="w-5 h-5 mx-auto text-[#27272a]" />
              <p>No matching commands found.</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 text-[#fafafa] border border-purple-500/30'
                      : 'text-[#a1a1aa] hover:bg-[#09090b] hover:text-[#fafafa] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg border ${
                        isSelected
                          ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                          : 'bg-[#09090b] text-[#71717a] border-[#27272a]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs">{item.title}</p>
                      <p className="text-[10px] text-[#71717a]">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.hotkey && (
                      <kbd className="px-2 py-0.5 rounded bg-[#09090b] border border-[#27272a] text-[10px] font-mono text-purple-400">
                        {item.hotkey}
                      </kbd>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-colors ${
                        isSelected ? 'text-purple-400' : 'text-transparent'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[#27272a] bg-[#09090b] flex items-center justify-between text-[10px] text-[#71717a] font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa]">↑↓</kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa]">↵</kbd>{' '}
              Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa]">ESC</kbd>{' '}
              Close
            </span>
          </div>
          <span className="text-purple-400">Ctrl+K Palette</span>
        </div>
      </div>
    </div>
  );
};
