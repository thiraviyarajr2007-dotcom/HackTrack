import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  List,
  Calendar,
  AlertCircle,
  Loader2,
  Check,
  ArrowRightLeft,
  Download,
  Upload,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { TaskItem, KanbanStatus } from '../types';
import { signInWithGoogle, getAccessToken, auth } from '../lib/firebase';

interface GoogleTasksViewProps {
  kanbanTasks?: TaskItem[];
  onAddKanbanTask?: (taskTitle: string) => void;
}

interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
}

interface GoogleTask {
  id: string;
  title: string;
  status: 'needsAction' | 'completed';
  notes?: string;
  due?: string;
  updated?: string;
}

export const GoogleTasksView: React.FC<GoogleTasksViewProps> = ({
  kanbanTasks = [],
  onAddKanbanTask,
}) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('@default');
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New List modal state
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Delete Confirmation Modal state (Mandatory per Workspace Skill)
  const [taskToDelete, setTaskToDelete] = useState<GoogleTask | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Check token on mount and auth state change
  useEffect(() => {
    getAccessToken().then((token) => {
      if (token) setAccessTokenState(token);
    });
  }, []);

  const fetchTaskLists = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setAccessTokenState(null);
          throw new Error('Google Tasks session expired. Please sign in again.');
        }
        throw new Error('Failed to fetch Google Task lists.');
      }
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        setTaskLists(data.items);
        if (data.items.length > 0) {
          setSelectedListId(data.items[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching task lists:', err);
      setError(err.message || 'Error connecting to Google Tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasksForList = useCallback(async (token: string, listId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(listId)}/tasks?showCompleted=true&showHidden=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        if (res.status === 401) {
          setAccessTokenState(null);
          throw new Error('Google Tasks session expired. Please sign in again.');
        }
        throw new Error('Failed to fetch tasks.');
      }
      const data = await res.json();
      setTasks(data.items || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Error fetching tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchTaskLists(accessToken);
    }
  }, [accessToken, fetchTaskLists]);

  useEffect(() => {
    if (accessToken && selectedListId) {
      fetchTasksForList(accessToken, selectedListId);
    }
  }, [accessToken, selectedListId, fetchTasksForList]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { accessToken: token, error: err } = await signInWithGoogle();
    if (token) {
      setAccessTokenState(token);
    } else if (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !accessToken || !selectedListId) return;

    setIsAdding(true);
    try {
      const payload: any = {
        title: newTaskTitle.trim(),
      };
      if (newTaskNotes.trim()) payload.notes = newTaskNotes.trim();
      if (newTaskDue) payload.due = new Date(newTaskDue).toISOString();

      const res = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(selectedListId)}/tasks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Failed to create task in Google Tasks');

      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskNotes('');
      setNewTaskDue('');
      setSyncMessage('Task added to Google Tasks!');
      setTimeout(() => setSyncMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add task.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTaskStatus = async (task: GoogleTask) => {
    if (!accessToken || !selectedListId) return;

    const newStatus: 'needsAction' | 'completed' =
      task.status === 'completed' ? 'needsAction' : 'completed';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(selectedListId)}/tasks/${encodeURIComponent(task.id)}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        // Revert on error
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
        );
        throw new Error('Failed to update task status.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task status.');
    }
  };

  // Mandatory Explicit Confirmation Modal handler for Deleting
  const confirmDeleteTask = async () => {
    if (!taskToDelete || !accessToken || !selectedListId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(selectedListId)}/tasks/${encodeURIComponent(taskToDelete.id)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok && res.status !== 204) {
        throw new Error('Failed to delete task.');
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
      setSyncMessage('Task removed from Google Tasks');
      setTimeout(() => setSyncMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !accessToken) return;

    setIsCreatingList(true);
    try {
      const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newListTitle.trim() }),
      });

      if (!res.ok) throw new Error('Failed to create list.');

      const newList = await res.json();
      setTaskLists((prev) => [...prev, newList]);
      setSelectedListId(newList.id);
      setNewListTitle('');
      setShowAddListModal(false);
      setSyncMessage(`New Google Task list "${newList.title}" created!`);
      setTimeout(() => setSyncMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create list.');
    } finally {
      setIsCreatingList(false);
    }
  };

  // Sync Google Task to Workspace Kanban
  const handleImportToKanban = (task: GoogleTask) => {
    if (onAddKanbanTask) {
      onAddKanbanTask(task.title);
      setSyncMessage(`Imported "${task.title}" into Workspace Kanban!`);
      setTimeout(() => setSyncMessage(null), 3000);
    }
  };

  // Export Workspace Kanban Tasks to Google Tasks
  const handleExportKanbanToGoogle = async () => {
    if (!accessToken || !selectedListId || kanbanTasks.length === 0) return;

    setLoading(true);
    let importedCount = 0;
    try {
      for (const kTask of kanbanTasks.slice(0, 5)) {
        await fetch(
          `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(selectedListId)}/tasks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: kTask.title,
              notes: `Domain: ${kTask.domain || 'General'} | Priority: ${kTask.priority || 'Medium'}`,
            }),
          }
        );
        importedCount++;
      }
      fetchTasksForList(accessToken, selectedListId);
      setSyncMessage(`Pushed ${importedCount} Kanban tasks to Google Tasks!`);
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err: any) {
      setError('Failed during bulk task export.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">Google Tasks Workspace Sync</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your official Google Tasks lists and seamlessly sync action items with your hackathon Kanban board.
          </p>
        </div>

        {accessToken && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTasksForList(accessToken, selectedListId)}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              <span>Refresh Tasks</span>
            </button>
            <a
              href="https://tasks.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 flex items-center space-x-1.5 transition-colors"
            >
              <span>Open Google Tasks</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs font-medium flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </motion.div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {!accessToken ? (
        /* Sign in with Google Card */
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-6 max-w-xl mx-auto shadow-xl">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
            <CheckSquare className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Connect Your Google Account</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Authorize Google Tasks permission to pull your actual Google tasks, organize them directly in HackTrack, or export your hackathon Kanban items.
            </p>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>
        </div>
      ) : (
        /* Connected Tasks Interface */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List Selector & Sync Actions */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <List className="w-4 h-4 text-blue-400" />
                  Your Google Task Lists
                </span>
                <button
                  onClick={() => setShowAddListModal(true)}
                  className="p-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 px-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {taskLists.map((list) => {
                  const isSelected = list.id === selectedListId;
                  return (
                    <button
                      key={list.id}
                      onClick={() => setSelectedListId(list.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                      }`}
                    >
                      <span className="truncate">{list.title}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sync with Kanban Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                Kanban Bridge
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Export your current Workspace Kanban tasks to this Google Tasks list or pull tasks into HackTrack.
              </p>
              <button
                onClick={handleExportKanbanToGoogle}
                disabled={loading || kanbanTasks.length === 0}
                className="w-full py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Export Kanban Tasks to Google</span>
              </button>
            </div>
          </div>

          {/* Right Column (Span 2): Add Task Form & Task Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Add Task Form */}
            <form
              onSubmit={handleAddTask}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3"
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Add Task to Google Tasks</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Notes/details (optional)..."
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAdding || !newTaskTitle.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/20"
                >
                  {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Add Google Task</span>
                </button>
              </div>
            </form>

            {/* Task List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Tasks ({tasks.length})
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {tasks.filter((t) => t.status === 'completed').length} Completed
                </span>
              </div>

              {loading && tasks.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
                  <p className="text-xs">Fetching Google Tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="py-10 text-center text-slate-500 space-y-2">
                  <CheckSquare className="w-8 h-8 mx-auto text-slate-700" />
                  <p className="text-xs">No tasks found in this list.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                  {tasks.map((task) => {
                    const isCompleted = task.status === 'completed';
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          isCompleted
                            ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 overflow-hidden">
                          <button
                            onClick={() => handleToggleTaskStatus(task)}
                            className={`w-5 h-5 rounded-lg border shrink-0 mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-700 hover:border-blue-400 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          <div className="flex-1 overflow-hidden">
                            <p
                              className={`text-xs font-semibold leading-snug ${
                                isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.notes && (
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                {task.notes}
                              </p>
                            )}
                            {task.due && (
                              <div className="flex items-center space-x-1 text-[10px] text-amber-400/90 mt-1 font-mono">
                                <Calendar className="w-3 h-3" />
                                <span>Due: {new Date(task.due).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleImportToKanban(task)}
                            title="Import to Workspace Kanban"
                            className="p-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTaskToDelete(task)}
                            title="Delete Google Task"
                            className="p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New List Creation */}
      <AnimatePresence>
        {showAddListModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <List className="w-4 h-4 text-blue-400" />
                Create New Google Task List
              </h3>
              <form onSubmit={handleCreateList} className="space-y-4">
                <input
                  type="text"
                  placeholder="List name (e.g., Hackathon Pitch Tasks)"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddListModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingList || !newListTitle.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                  >
                    {isCreatingList ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Create List</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mandatory User Confirmation Modal for Task Deletion */}
      <AnimatePresence>
        {taskToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Confirm Google Task Deletion</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-white">"{taskToDelete.title}"</strong> from your official Google Tasks? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskToDelete(null)}
                  disabled={isDeleting}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteTask}
                  disabled={isDeleting}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  <span>Delete Task</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
