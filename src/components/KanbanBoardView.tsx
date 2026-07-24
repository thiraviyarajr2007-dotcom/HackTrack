import React, { useState } from 'react';
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
} from 'lucide-react';
import { TaskItem, KanbanStatus, TeamMember } from '../types';

interface KanbanBoardViewProps {
  tasks: TaskItem[];
  teamMembers: TeamMember[];
  onAddTask: (task: TaskItem) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: KanbanStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenGitHubSync?: () => void;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  tasks,
  teamMembers,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onOpenGitHubSync,
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
    'To Do': 'border-slate-800 bg-slate-900/60',
    'In Progress': 'border-purple-500/30 bg-purple-950/20',
    Testing: 'border-amber-500/30 bg-amber-950/20',
    Submitted: 'border-cyan-500/30 bg-cyan-950/20',
    Completed: 'border-emerald-500/30 bg-emerald-950/20',
  };

  const columnTitleColor: Record<KanbanStatus, string> = {
    'To Do': 'text-slate-400',
    'In Progress': 'text-purple-400',
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Kanban className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">Kanban Board</h1>
          </div>
          <p className="text-xs text-slate-400">
            Manage task workflow from To Do to Completed & Submitted states.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenGitHubSync && (
            <button
              onClick={onOpenGitHubSync}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-purple-500/40 text-purple-300 flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <Github className="w-4 h-4 text-purple-400" />
              <span>Sync GitHub Commits</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Kanban Card</span>
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
              className={`rounded-xl border p-3 flex flex-col min-h-[500px] ${columnBg[col]}`}
            >
              {/* Column Title Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${columnTitleColor[col]}`}>
                  {col}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks Container */}
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {colTasks.map((task) => {
                  const assigned = teamMembers.find((m) => m.id === task.assignedMemberId);
                  const currentIdx = columns.indexOf(col);

                  return (
                    <div
                      key={task.id}
                      className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-xl p-3 shadow-md space-y-2 group transition-all"
                    >
                      {/* Priority Tag & Delete */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
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
                      <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>

                      {/* Subtasks Progress */}
                      {task.subtasks.length > 0 && (
                        <div className="text-[10px] text-slate-400 flex items-center justify-between bg-slate-950 p-1.5 rounded">
                          <span>Subtasks</span>
                          <span className="font-bold text-purple-400">
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
                              className="w-5 h-5 rounded-full object-cover border border-purple-500/30"
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
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              title={`Move to ${columns[currentIdx - 1]}`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {currentIdx < columns.length - 1 && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, columns[currentIdx + 1])}
                              className="p-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 cursor-pointer"
                              title={`Move to ${columns[currentIdx + 1]}`}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-slate-600 text-xs">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-4">Create New Kanban Task Card</h2>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrate Gemini AI API"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details and requirements..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Column</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as KanbanStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    {columns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assigned Team Member</label>
                <select
                  value={formMember}
                  onChange={(e) => setFormMember(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
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
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
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
