import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Kanban,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Tag,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  X,
  Trash2,
  Github,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { TaskItem, KanbanStatus, TeamMember } from '../types';

interface KanbanBoardViewProps {
  tasks: TaskItem[];
  teamMembers: TeamMember[];
  onAddTask: (task: TaskItem) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: KanbanStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenGitHubSync?: () => void;
  onOpenGoogleTasks?: () => void;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  tasks,
  teamMembers,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onOpenGitHubSync,
  onOpenGoogleTasks,
}) => {
  const columns: KanbanStatus[] = ['To Do', 'In Progress', 'Testing', 'Submitted', 'Completed'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState<KanbanStatus>('To Do');
  const [formMember, setFormMember] = useState('m1');
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [formTag, setFormTag] = useState('Frontend');

  const columnBg: Record<KanbanStatus, string> = {
    'To Do': 'border-slate-800/80 bg-slate-900/40',
    'In Progress': 'border-indigo-500/30 bg-indigo-950/20',
    Testing: 'border-amber-500/30 bg-amber-950/20',
    Submitted: 'border-cyan-500/30 bg-cyan-950/20',
    Completed: 'border-emerald-500/30 bg-emerald-950/20',
  };

  const columnTitleColor: Record<KanbanStatus, string> = {
    'To Do': 'text-slate-400',
    'In Progress': 'text-indigo-400',
    Testing: 'text-amber-400',
    Submitted: 'text-cyan-400',
    Completed: 'text-emerald-400',
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newTask: TaskItem = {
      id: `t_${Date.now()}`,
      title: formTitle,
      description: formDesc || 'Task details...',
      status: formStatus,
      hackathonId: 'h1',
      assignedMemberId: formMember,
      priority: formPriority,
      dueDate: new Date().toISOString().split('T')[0],
      subtasks: [],
      tags: [formTag],
    };

    onAddTask(newTask);
    setShowAddModal(false);
    setFormTitle('');
    setFormDesc('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Kanban className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-black text-white">Kanban Workflow Board</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track and move task cards across To Do, In Progress, Testing, Submitted, and Completed columns.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {onOpenGoogleTasks && (
            <button
              onClick={onOpenGoogleTasks}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-200 flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>Google Tasks OAuth</span>
            </button>
          )}

          {onOpenGitHubSync && (
            <button
              onClick={onOpenGitHubSync}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-slate-200 flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <Github className="w-4 h-4 text-purple-400" />
              <span>GitHub Commits</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task Card</span>
          </button>
        </div>
      </div>

      {/* 5-Column Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto custom-scrollbar pb-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col);

          return (
            <div
              key={col}
              className={`rounded-[20px] border p-3.5 flex flex-col min-h-[520px] glass-card ${columnBg[col]}`}
            >
              {/* Column Title Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <span className={`text-xs font-heading font-bold uppercase tracking-wider ${columnTitleColor[col]}`}>
                  {col}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks Container */}
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {colTasks.map((task) => {
                  const assigned = teamMembers.find((m) => m.id === task.assignedMemberId);
                  const currentIdx = columns.indexOf(col);

                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2 }}
                      className="bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-3.5 shadow-lg space-y-2.5 group transition-all"
                    >
                      {/* Priority Tag & Delete */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                            task.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : task.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all cursor-pointer p-1"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Title & Desc */}
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">{task.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>

                      {/* Subtasks Progress */}
                      {task.subtasks.length > 0 && (
                        <div className="text-[10px] text-slate-400 flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span>Subtasks</span>
                          <span className="font-mono font-bold text-indigo-400">
                            {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
                          </span>
                        </div>
                      )}

                      {/* Assigned Member & Move Actions */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        {assigned && (
                          <div className="flex items-center space-x-1.5" title={assigned.name}>
                            <img
                              src={assigned.avatar}
                              alt={assigned.name}
                              className="w-5 h-5 rounded-full object-cover border border-slate-700"
                            />
                            <span className="text-[10px] text-slate-300 font-medium truncate max-w-[80px]">
                              {assigned.name.split(' ')[0]}
                            </span>
                          </div>
                        )}

                        {/* Status Shift Buttons */}
                        <div className="flex items-center space-x-1">
                          {currentIdx > 0 && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, columns[currentIdx - 1])}
                              className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                              title={`Move to ${columns[currentIdx - 1]}`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {currentIdx < columns.length - 1 && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, columns[currentIdx + 1])}
                              className="p-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 cursor-pointer transition-colors"
                              title={`Move to ${columns[currentIdx + 1]}`}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-32 border border-dashed border-slate-800/80 rounded-2xl flex items-center justify-center text-slate-500 text-xs text-center p-4">
                    No cards in {col}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative cursor-default space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-heading font-bold text-white">Create New Task Card</h2>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrate Gemini AI API"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details and requirements..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Initial Column</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as KanbanStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  >
                    {columns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Assigned Team Member</label>
                <select
                  value={formMember}
                  onChange={(e) => setFormMember(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                >
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold cursor-pointer shadow-md shadow-indigo-600/25"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

