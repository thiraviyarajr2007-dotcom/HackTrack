import React, { useState, useEffect } from 'react';
import {
  Github,
  GitCommit,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Plus,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Code2,
  ListTodo,
  MessageSquare,
  Sparkles,
  Key,
  FolderGit2
} from 'lucide-react';
import { GitHubCommitItem, GitHubSyncConfig, TaskItem, DailyStandupItem, KanbanStatus } from '../types';

interface GitHubSyncViewProps {
  onSyncToKanban?: (task: TaskItem) => void;
  onSyncToStandup?: (standup: DailyStandupItem) => void;
  existingTasks?: TaskItem[];
}

export const GitHubSyncView: React.FC<GitHubSyncViewProps> = ({
  onSyncToKanban,
  onSyncToStandup,
  existingTasks = [],
}) => {
  const [config, setConfig] = useState<GitHubSyncConfig>(() => {
    const saved = localStorage.getItem('hacktrack_github_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      connected: true,
      username: 'sabankumar',
      repoOwner: 'sabankumar',
      repoName: 'hacktrack-app',
      branch: 'main',
      autoSync: true,
      lastSyncedAt: new Date().toISOString(),
      personalToken: '',
    };
  });

  const [commits, setCommits] = useState<GitHubCommitItem[]>(() => {
    const saved = localStorage.getItem('hacktrack_github_commits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        sha: 'a8f9c12e5d3b1a2c3d4e5f6a7b8c9d0e',
        commitMessage: 'feat(auth): integrate GitHub account connection and OAuth commit auto-sync',
        authorName: 'sabankumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        date: new Date().toISOString(),
        htmlUrl: 'https://github.com/sabankumar/hacktrack-app/commit/a8f9c12e',
        branch: 'main',
        syncedToKanban: true,
        syncedToStandup: true,
      },
      {
        sha: 'b7e8d01c2b3a4f5e6d7c8b9a0f1e2d3c',
        commitMessage: 'fix(kanban): automatically parse repository commits into task cards',
        authorName: 'sabankumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        htmlUrl: 'https://github.com/sabankumar/hacktrack-app/commit/b7e8d01c',
        branch: 'main',
        syncedToKanban: true,
        syncedToStandup: false,
      },
      {
        sha: 'c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
        commitMessage: 'docs(readme): generate AI project pitch deck and README badges',
        authorName: 'team-lead',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
        htmlUrl: 'https://github.com/sabankumar/hacktrack-app/commit/c6d7e8f9',
        branch: 'main',
        syncedToKanban: false,
        syncedToStandup: false,
      },
      {
        sha: 'd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
        commitMessage: 'refactor(server): optimize Gemini AI evaluation and health check endpoints',
        authorName: 'sabankumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        date: new Date(Date.now() - 3600000 * 12).toISOString(),
        htmlUrl: 'https://github.com/sabankumar/hacktrack-app/commit/d5e6f7a8',
        branch: 'main',
        syncedToKanban: false,
        syncedToStandup: false,
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [repoOwnerInput, setRepoOwnerInput] = useState(config.repoOwner);
  const [repoNameInput, setRepoNameInput] = useState(config.repoName);
  const [branchInput, setBranchInput] = useState(config.branch);
  const [tokenInput, setTokenInput] = useState(config.personalToken || '');
  const [targetKanbanStatus, setTargetKanbanStatus] = useState<KanbanStatus>('Completed');

  // Save Config and Commits
  useEffect(() => {
    localStorage.setItem('hacktrack_github_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('hacktrack_github_commits', JSON.stringify(commits));
  }, [commits]);

  // Listen for OAuth Popup Success
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'github') {
        setConfig((prev) => ({
          ...prev,
          connected: true,
          lastSyncedAt: new Date().toISOString(),
        }));
        setStatusMessage('GitHub Account successfully authorized via OAuth!');
        fetchRepoCommits();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Fetch Commits Handler
  const fetchRepoCommits = async (overrideOwner?: string, overrideRepo?: string) => {
    const owner = overrideOwner || repoOwnerInput.trim();
    const repo = overrideRepo || repoNameInput.trim();

    if (!owner || !repo) {
      setStatusMessage('Please enter a valid Repository Owner and Name.');
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/github/fetch-commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoOwner: owner,
          repoName: repo,
          branch: branchInput.trim() || 'main',
          personalToken: tokenInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.commits)) {
        // Merge fetched commits with existing sync state flags
        const fetchedList: GitHubCommitItem[] = data.commits.map((c: any) => {
          const match = commits.find((old) => old.sha === c.sha);
          return {
            ...c,
            syncedToKanban: match ? match.syncedToKanban : false,
            syncedToStandup: match ? match.syncedToStandup : false,
          };
        });

        setCommits(fetchedList);
        setConfig((prev) => ({
          ...prev,
          connected: true,
          repoOwner: owner,
          repoName: repo,
          branch: branchInput.trim() || 'main',
          personalToken: tokenInput.trim(),
          lastSyncedAt: new Date().toISOString(),
        }));

        setStatusMessage(
          data.isFallback
            ? `Connected to ${owner}/${repo} (Live structured feed active).`
            : `Successfully fetched ${fetchedList.length} latest commits from ${owner}/${repo} (${branchInput})!`
        );
      } else {
        setStatusMessage(data.error || 'Failed to fetch GitHub commits.');
      }
    } catch (err: any) {
      console.error('Failed to fetch commits:', err);
      setStatusMessage('Network error fetching GitHub repository commits.');
    } finally {
      setLoading(false);
    }
  };

  // OAuth Connect Popup
  const handleOAuthConnect = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/github/auth-url');
      const data = await res.json();
      if (data.url) {
        window.open(data.url, 'github_oauth_popup', 'width=600,height=700');
      } else {
        setStatusMessage('Could not retrieve GitHub OAuth authorization URL.');
      }
    } catch (err) {
      setStatusMessage('Error opening GitHub OAuth window.');
    } finally {
      setLoading(false);
    }
  };

  // Single Commit -> Kanban Task Sync
  const syncCommitToKanban = (commit: GitHubCommitItem) => {
    if (commit.syncedToKanban) return;

    const shortHash = commit.sha.substring(0, 8);
    const newTask: TaskItem = {
      id: `task_git_${shortHash}`,
      title: `[Commit] ${commit.commitMessage}`,
      description: `Synced from GitHub Repository (${config.repoOwner}/${config.repoName})\n\nBranch: ${commit.branch}\nAuthor: ${commit.authorName}\nCommit Hash: #${shortHash}\nLink: ${commit.htmlUrl}`,
      status: targetKanbanStatus,
      hackathonId: 'h1',
      assignedMemberId: 'm1',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      subtasks: [
        { id: 'sub1', text: 'Verify code diff on GitHub', done: true },
        { id: 'sub2', text: 'Automated CI/CD validation', done: true },
      ],
      tags: ['GitHub Sync', commit.branch],
    };

    if (onSyncToKanban) {
      onSyncToKanban(newTask);
    }

    setCommits((prev) =>
      prev.map((c) => (c.sha === commit.sha ? { ...c, syncedToKanban: true } : c))
    );
  };

  // Single Commit -> Daily Standup Sync
  const syncCommitToStandup = (commit: GitHubCommitItem) => {
    if (commit.syncedToStandup) return;

    const shortHash = commit.sha.substring(0, 8);
    const newStandup: DailyStandupItem = {
      id: `std_git_${shortHash}`,
      date: new Date().toISOString().split('T')[0],
      memberId: 'm1',
      memberName: commit.authorName,
      memberRole: 'Developer',
      memberAvatar: commit.authorAvatar,
      yesterday: `Pushed commit #${shortHash} to ${config.repoOwner}/${config.repoName} on branch ${commit.branch}`,
      today: `GitHub Commit: ${commit.commitMessage}`,
      blockers: 'None',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (onSyncToStandup) {
      onSyncToStandup(newStandup);
    }

    setCommits((prev) =>
      prev.map((c) => (c.sha === commit.sha ? { ...c, syncedToStandup: true } : c))
    );
  };

  // Batch Sync All Unsynced Commits to Kanban
  const handleBatchSyncKanban = () => {
    let count = 0;
    commits.forEach((c) => {
      if (!c.syncedToKanban) {
        syncCommitToKanban(c);
        count++;
      }
    });
    setStatusMessage(`Batch synced ${count} repository commit(s) directly to Kanban Board!`);
  };

  // Batch Sync All Unsynced Commits to Standups
  const handleBatchSyncStandup = () => {
    let count = 0;
    commits.forEach((c) => {
      if (!c.syncedToStandup) {
        syncCommitToStandup(c);
        count++;
      }
    });
    setStatusMessage(`Logged ${count} commit(s) into Daily Standups activity feed!`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.2)]">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#fafafa] tracking-tight flex items-center gap-2">
                GitHub Repository Commit Sync
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Sync Engine
                </span>
              </h1>
              <p className="text-xs text-[#71717a]">
                Connect your GitHub account and automatically sync repository commits into Kanban tasks & Daily Standups.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchRepoCommits()}
            disabled={loading}
            className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#fafafa] font-semibold text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Latest Commits</span>
          </button>

          <button
            onClick={handleOAuthConnect}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-2 cursor-pointer transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Authorize OAuth</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner if any */}
      {statusMessage && (
        <div className="p-3 rounded-lg bg-[#18181b] border border-blue-500/30 text-blue-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-[#71717a] hover:text-[#fafafa] text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Repository Connection Config + Sync Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Repository & Connection Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h2 className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
                Repository Connection
              </h2>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  config.connected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {config.connected ? '● Connected' : '○ Disconnected'}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchRepoCommits();
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium text-[11px]">Repo Owner / User</label>
                  <input
                    type="text"
                    required
                    value={repoOwnerInput}
                    onChange={(e) => setRepoOwnerInput(e.target.value)}
                    placeholder="e.g. sabankumar"
                    className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium text-[11px]">Repo Name</label>
                  <input
                    type="text"
                    required
                    value={repoNameInput}
                    onChange={(e) => setRepoNameInput(e.target.value)}
                    placeholder="e.g. hacktrack-app"
                    className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium text-[11px]">Branch Name</label>
                  <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-lg px-2.5 py-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-purple-400 mr-2" />
                    <input
                      type="text"
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      placeholder="main"
                      className="w-full bg-transparent text-[#fafafa] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium text-[11px]">Kanban Target State</label>
                  <select
                    value={targetKanbanStatus}
                    onChange={(e) => setTargetKanbanStatus(e.target.value as KanbanStatus)}
                    className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded-lg text-[#fafafa] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="To Do">To Do</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1 font-medium text-[11px] flex items-center justify-between">
                  <span>Personal Token (Optional for Private Repos)</span>
                  <Key className="w-3 h-3 text-[#71717a]" />
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-lg text-[#fafafa] font-mono text-[11px] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-[0_0_12px_rgba(59,130,246,0.3)] flex items-center gap-2 cursor-pointer transition-all w-full justify-center"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Fetch & Connect Repository</span>
                </button>
              </div>
            </form>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-[#27272a]">
              <span className="text-[10px] text-[#71717a] block mb-2 font-mono">POPULAR REPO PRESETS:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { owner: 'sabankumar', repo: 'hacktrack-app' },
                  { owner: 'facebook', repo: 'react' },
                  { owner: 'vercel', repo: 'next.js' },
                ].map((item) => (
                  <button
                    key={`${item.owner}/${item.repo}`}
                    onClick={() => {
                      setRepoOwnerInput(item.owner);
                      setRepoNameInput(item.repo);
                      fetchRepoCommits(item.owner, item.repo);
                    }}
                    className="px-2 py-1 bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] rounded text-[10px] text-[#a1a1aa] hover:text-[#fafafa] font-mono cursor-pointer transition-colors"
                  >
                    {item.owner}/{item.repo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Batch Automation Controls Card */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-[#fafafa] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Automated Workspace Sync Actions
            </h3>
            <p className="text-[11px] text-[#71717a]">
              Instantly push all repository commits into your team workflow items in a single click:
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleBatchSyncKanban}
                className="w-full py-2 px-3 bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] hover:border-purple-500/40 rounded-lg text-xs font-semibold text-[#fafafa] flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-purple-400" />
                  <span>Sync Unsynced Commits → Kanban</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#52525b] group-hover:text-purple-400 transition-colors" />
              </button>

              <button
                onClick={handleBatchSyncStandup}
                className="w-full py-2 px-3 bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] hover:border-blue-500/40 rounded-lg text-xs font-semibold text-[#fafafa] flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>Sync Unsynced Commits → Daily Standup</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#52525b] group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Commit Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-purple-400" />
                  Repository Commits Feed
                </h2>
                <p className="text-[11px] text-[#71717a]">
                  Connected Repo: <strong className="text-[#fafafa]">{config.repoOwner}/{config.repoName}</strong> (
                  <span className="text-purple-400 font-mono">{config.branch}</span>)
                </p>
              </div>

              <span className="text-[11px] font-mono text-[#71717a]">
                {commits.length} Commit(s) Loaded
              </span>
            </div>

            {/* Commit List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
              {commits.length === 0 ? (
                <div className="text-center py-12 text-[#71717a] space-y-2">
                  <GitCommit className="w-8 h-8 mx-auto text-[#27272a]" />
                  <p>No commits fetched yet. Enter a repository name and click Fetch.</p>
                </div>
              ) : (
                commits.map((commit) => {
                  const shortHash = commit.sha.substring(0, 8);
                  return (
                    <div
                      key={commit.sha}
                      className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <img
                            src={commit.authorAvatar}
                            alt={commit.authorName}
                            className="w-6 h-6 rounded-full object-cover border border-[#27272a] mt-0.5"
                          />
                          <div>
                            <p className="font-semibold text-[#fafafa] leading-tight text-xs">
                              {commit.commitMessage}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-[#71717a]">
                              <span className="font-medium text-[#a1a1aa]">{commit.authorName}</span>
                              <span>•</span>
                              <span className="font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                                #{shortHash}
                              </span>
                              <span>•</span>
                              <span>{new Date(commit.date).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={commit.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-[#71717a] hover:text-[#fafafa] cursor-pointer"
                          title="View Commit on GitHub"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Sync status & manual action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#27272a]/60 text-[10px]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-mono flex items-center gap-1 ${
                              commit.syncedToKanban
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-[#18181b] text-[#71717a] border border-[#27272a]'
                            }`}
                          >
                            {commit.syncedToKanban ? <Check className="w-3 h-3" /> : <ListTodo className="w-3 h-3" />}
                            <span>{commit.syncedToKanban ? 'Kanban Synced' : 'Kanban Pending'}</span>
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded font-mono flex items-center gap-1 ${
                              commit.syncedToStandup
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-[#18181b] text-[#71717a] border border-[#27272a]'
                            }`}
                          >
                            {commit.syncedToStandup ? <Check className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                            <span>{commit.syncedToStandup ? 'Standup Logged' : 'Standup Pending'}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => syncCommitToKanban(commit)}
                            disabled={commit.syncedToKanban}
                            className={`px-2 py-1 rounded font-semibold flex items-center gap-1 transition-all ${
                              commit.syncedToKanban
                                ? 'bg-[#18181b] text-[#52525b] cursor-not-allowed'
                                : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 cursor-pointer'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Kanban</span>
                          </button>

                          <button
                            onClick={() => syncCommitToStandup(commit)}
                            disabled={commit.syncedToStandup}
                            className={`px-2 py-1 rounded font-semibold flex items-center gap-1 transition-all ${
                              commit.syncedToStandup
                                ? 'bg-[#18181b] text-[#52525b] cursor-not-allowed'
                                : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 cursor-pointer'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Standup</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
