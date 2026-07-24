import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { HackathonBoardView } from './components/HackathonBoardView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { TeamWorkspaceView } from './components/TeamWorkspaceView';
import { AIIdeaGeneratorView } from './components/AIIdeaGeneratorView';
import { AIPptGeneratorView } from './components/AIPptGeneratorView';
import { AIReadmeGeneratorView } from './components/AIReadmeGeneratorView';
import { AIPitchGeneratorView } from './components/AIPitchGeneratorView';
import { AIProjectEvaluationView } from './components/AIProjectEvaluationView';
import { AIJudgeSimulatorView } from './components/AIJudgeSimulatorView';
import { AICodeReviewerView } from './components/AICodeReviewerView';
import { DocumentCenterView } from './components/DocumentCenterView';
import { TimelineView } from './components/TimelineView';
import { ProgressRingView } from './components/ProgressRingView';
import { DailyStandupView } from './components/DailyStandupView';
import { DeadlineCountdownView } from './components/DeadlineCountdownView';
import { NotesView } from './components/NotesView';
import { ResourceLibraryView } from './components/ResourceLibraryView';
import { ExpenseTrackerView } from './components/ExpenseTrackerView';
import { AchievementView } from './components/AchievementView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { GitHubSyncView } from './components/GitHubSyncView';
import { GoogleTasksView } from './components/GoogleTasksView';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import {
  logoutFirebase,
  auth,
  onAuthStateChanged,
  subscribeToWorkspace,
  saveWorkspaceToFirestore,
} from './lib/firebase';

import {
  initialHackathons,
  initialTasks,
  initialTeamMembers,
  initialDocuments,
  initialTimelineMilestones,
  initialStandups,
  initialDeadlines,
  initialNotes,
  initialResources,
  initialExpenses,
  initialAchievements,
  initialNotifications,
} from './data/initialData';

import {
  HackathonItem,
  TaskItem,
  TeamMember,
  DocumentItem,
  TimelineMilestone,
  DailyStandupItem,
  DeadlineTimer,
  NoteItem,
  ResourceItem,
  ExpenseItem,
  AchievementItem,
  NotificationItem,
  KanbanStatus,
  UserProfile,
  RolePermissions,
} from './types';

export function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'Team Leader' | 'Member' | 'Mentor'>('Team Leader');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active Authenticated User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('hacktrack_active_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // Fallback
      }
    }
    return {
      id: 'usr_sabankumar',
      name: 'Sabankumar',
      email: 'sabankumar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      provider: 'Google',
      createdAt: new Date().toISOString(),
      role: 'Team Leader',
    };
  });

  // Global Workspace Database State
  const getInitialWorkspaceCollection = <T,>(key: string, fallback: T[]): T[] => {
    try {
      const savedUser = localStorage.getItem('hacktrack_active_user');
      const userId = savedUser ? JSON.parse(savedUser)?.id || 'usr_sabankumar' : 'usr_sabankumar';
      const localData = localStorage.getItem(`hacktrack_workspace_${userId}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed[key])) {
          return parsed[key];
        }
      }
    } catch (e) {}
    return fallback;
  };

  const [hackathons, setHackathons] = useState<HackathonItem[]>(() =>
    getInitialWorkspaceCollection('hackathons', initialHackathons)
  );
  const [kanbanTasks, setKanbanTasks] = useState<TaskItem[]>(() =>
    getInitialWorkspaceCollection('kanbanTasks', initialTasks)
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    getInitialWorkspaceCollection('teamMembers', initialTeamMembers)
  );
  const [documents, setDocuments] = useState<DocumentItem[]>(() =>
    getInitialWorkspaceCollection('documents', initialDocuments)
  );
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() =>
    getInitialWorkspaceCollection('milestones', initialTimelineMilestones)
  );
  const [standups, setStandups] = useState<DailyStandupItem[]>(() =>
    getInitialWorkspaceCollection('standups', initialStandups)
  );
  const [deadlines, setDeadlines] = useState<DeadlineTimer[]>(() =>
    getInitialWorkspaceCollection('deadlines', initialDeadlines)
  );
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    getInitialWorkspaceCollection('notes', initialNotes)
  );
  const [resources, setResources] = useState<ResourceItem[]>(() =>
    getInitialWorkspaceCollection('resources', initialResources)
  );
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() =>
    getInitialWorkspaceCollection('expenses', initialExpenses)
  );
  const [achievements, setAchievements] = useState<AchievementItem[]>(() =>
    getInitialWorkspaceCollection('achievements', initialAchievements)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getInitialWorkspaceCollection('notifications', initialNotifications)
  );
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({
    member: {
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: false,
      canUploadDocuments: true,
      canLogExpenses: true,
      canSubmitStandups: true,
      canEditHackathons: false,
    },
    mentor: {
      canViewWorkspace: true,
      canCreateReviews: true,
      canEditTasks: false,
      canManageMembers: false,
      canSubmitProject: false,
    },
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts Listener (Ctrl+K, Cmd+K, ⌘1-5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.metaKey || e.ctrlKey) {
        if (e.key === '1') {
          e.preventDefault();
          setCurrentView('dashboard');
        } else if (e.key === '2') {
          e.preventDefault();
          setCurrentView('hackathon-board');
        } else if (e.key === '3') {
          e.preventDefault();
          setCurrentView('kanban');
        } else if (e.key === '4') {
          e.preventDefault();
          setCurrentView('github-sync');
        } else if (e.key === '5') {
          e.preventDefault();
          setCurrentView('timeline');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track whether snapshot update is processing to avoid echo writes
  const isSyncingFromFirestore = React.useRef(false);
  const isFirestoreLoaded = React.useRef(false);

  // Real-Time Firestore Workspace Subscription across all devices
  useEffect(() => {
    if (!currentUser?.id) return;
    isFirestoreLoaded.current = false;

    const unsubscribe = subscribeToWorkspace(
      currentUser.id,
      (data) => {
        isSyncingFromFirestore.current = true;
        isFirestoreLoaded.current = true;

        if (Array.isArray(data.hackathons)) setHackathons(data.hackathons);
        if (Array.isArray(data.kanbanTasks)) setKanbanTasks(data.kanbanTasks);
        if (Array.isArray(data.teamMembers)) setTeamMembers(data.teamMembers);
        if (Array.isArray(data.documents)) setDocuments(data.documents);
        if (Array.isArray(data.milestones)) setMilestones(data.milestones);
        if (Array.isArray(data.standups)) setStandups(data.standups);
        if (Array.isArray(data.deadlines)) setDeadlines(data.deadlines);
        if (Array.isArray(data.notes)) setNotes(data.notes);
        if (Array.isArray(data.resources)) setResources(data.resources);
        if (Array.isArray(data.expenses)) setExpenses(data.expenses);
        if (Array.isArray(data.achievements)) setAchievements(data.achievements);
        if (Array.isArray(data.notifications)) setNotifications(data.notifications);
        if (data.rolePermissions) setRolePermissions(data.rolePermissions);

        // Also cache locally for offline instant boot
        const key = `hacktrack_workspace_${currentUser.id}`;
        localStorage.setItem(key, JSON.stringify(data));
        setTimeout(() => {
          isSyncingFromFirestore.current = false;
        }, 150);
      },
      () => {
        // Document does not exist in Firestore for this UID yet -> seed Firestore with current local data
        isFirestoreLoaded.current = true;
        const currentData = {
          hackathons,
          kanbanTasks,
          teamMembers,
          documents,
          milestones,
          standups,
          deadlines,
          notes,
          resources,
          expenses,
          achievements,
          notifications,
          rolePermissions,
        };
        saveWorkspaceToFirestore(currentUser.id, currentData);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.id]);

  // Save changes to Firebase Firestore (and local cache) whenever state updates
  useEffect(() => {
    if (!currentUser?.id) return;
    if (isSyncingFromFirestore.current) return;
    if (!isFirestoreLoaded.current) return;

    const workspaceData = {
      hackathons,
      kanbanTasks,
      teamMembers,
      documents,
      milestones,
      standups,
      deadlines,
      notes,
      resources,
      expenses,
      achievements,
      notifications,
      rolePermissions,
    };

    // Auto-save to Firestore for real-time multi-device sync
    saveWorkspaceToFirestore(currentUser.id, workspaceData);

    // Save to LocalStorage as offline cache
    localStorage.setItem(`hacktrack_workspace_${currentUser.id}`, JSON.stringify(workspaceData));
    localStorage.setItem('hacktrack_active_user', JSON.stringify(currentUser));
  }, [
    currentUser,
    hackathons,
    kanbanTasks,
    teamMembers,
    documents,
    milestones,
    standups,
    deadlines,
    notes,
    resources,
    expenses,
    achievements,
    notifications,
    rolePermissions,
  ]);

  const handleSavePermissions = async (updated: RolePermissions, rulesCode: string) => {
    setRolePermissions(updated);
    if (currentUser?.id) {
      await saveWorkspaceToFirestore(currentUser.id, {
        hackathons,
        kanbanTasks,
        teamMembers,
        documents,
        milestones,
        standups,
        deadlines,
        notes,
        resources,
        expenses,
        achievements,
        notifications,
        rolePermissions: updated,
      });
    }
  };

  // Load Sample Data Handler
  const handleLoadSampleData = () => {
    setHackathons(initialHackathons);
    setKanbanTasks(initialTasks);
    setTeamMembers(initialTeamMembers);
    setDocuments(initialDocuments);
    setMilestones(initialTimelineMilestones);
    setStandups(initialStandups);
    setDeadlines(initialDeadlines);
    setNotes(initialNotes);
    setResources(initialResources);
    setExpenses(initialExpenses);
    setAchievements(initialAchievements);
    setNotifications(initialNotifications);
  };

  // Clear Workspace Handler
  const handleClearWorkspace = () => {
    setHackathons([]);
    setKanbanTasks([]);
    setTeamMembers([]);
    setDocuments([]);
    setMilestones([]);
    setStandups([]);
    setDeadlines([]);
    setNotes([]);
    setResources([]);
    setExpenses([]);
    setAchievements([]);
    setNotifications([]);

    if (currentUser?.id) {
      const emptyData = {
        hackathons: [],
        kanbanTasks: [],
        teamMembers: [],
        documents: [],
        milestones: [],
        standups: [],
        deadlines: [],
        notes: [],
        resources: [],
        expenses: [],
        achievements: [],
        notifications: [],
        rolePermissions,
      };
      saveWorkspaceToFirestore(currentUser.id, emptyData);
      localStorage.setItem(`hacktrack_workspace_${currentUser.id}`, JSON.stringify(emptyData));
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile, isNewAccount: boolean) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (isNewAccount) {
      handleClearWorkspace();
    }
  };

  // Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const isGithub = fbUser.providerData.some((p) => p.providerId === 'github.com');
        const providerName = isGithub ? 'GitHub' : 'Google';

        setCurrentUser((prev) => {
          const updated: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || prev?.name || 'Sabankumar',
            email: fbUser.email || prev?.email || 'sabankumar@gmail.com',
            avatar: fbUser.photoURL || prev?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            provider: providerName,
            createdAt: prev?.createdAt || new Date().toISOString(),
            role: prev?.role || userRole || 'Team Leader',
          };
          localStorage.setItem('hacktrack_active_user', JSON.stringify(updated));
          return updated;
        });
      }
    });
    return () => unsubscribe();
  }, [userRole]);

  const handleLogout = async () => {
    await logoutFirebase();
    setCurrentUser(null);
    localStorage.removeItem('hacktrack_active_user');
    setIsAuthModalOpen(true);
  };

  // Handlers
  const handleAddHackathon = (newHack: HackathonItem) => {
    setHackathons([newHack, ...hackathons]);
  };

  const handleUpdateHackathon = (updated: HackathonItem) => {
    setHackathons(hackathons.map((h) => (h.id === updated.id ? updated : h)));
  };

  const handleDeleteHackathon = (id: string) => {
    setHackathons(hackathons.filter((h) => h.id !== id));
  };

  const handleAddTask = (task: TaskItem) => {
    setKanbanTasks([task, ...kanbanTasks]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: KanbanStatus) => {
    setKanbanTasks(
      kanbanTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setKanbanTasks(kanbanTasks.filter((t) => t.id !== taskId));
  };

  const handleAddMember = (m: TeamMember) => {
    setTeamMembers([...teamMembers, m]);
  };

  const handleUpdateMember = (updated: TeamMember) => {
    setTeamMembers(teamMembers.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleAddDocument = (doc: DocumentItem) => {
    setDocuments([doc, ...documents]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones(
      milestones.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleAddMilestone = (milestone: TimelineMilestone) => {
    setMilestones([...milestones, milestone]);
  };

  const handleAddStandup = (item: DailyStandupItem) => {
    setStandups([item, ...standups]);
  };

  const handleAddDeadline = (timer: DeadlineTimer) => {
    setDeadlines([timer, ...deadlines]);
  };

  const handleAddNote = (note: NoteItem) => {
    setNotes([note, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleAddResource = (res: ResourceItem) => {
    setResources([res, ...resources]);
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const handleAddExpense = (exp: ExpenseItem) => {
    setExpenses([exp, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleAddAchievement = (ach: AchievementItem) => {
    setAchievements([ach, ...achievements]);
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(achievements.filter((a) => a.id !== id));
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleAddNotification = (notif: NotificationItem) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        userRole={userRole}
        onRoleChange={setUserRole}
        notifications={notifications}
        onMarkRead={handleMarkNotificationsRead}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onClearWorkspace={handleClearWorkspace}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        activeHackathonsCount={hackathons.length}
        completedHackathonsCount={hackathons.filter((h) => h.status === 'Won' || h.status === 'Submitted').length}
        upcomingDeadlinesCount={deadlines.length}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            setMobileSidebarOpen(false);
          }}
          isOpenMobile={mobileSidebarOpen}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* View Router Main Stage */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <DashboardView
                userName={currentUser?.name || 'Sabankumar'}
                hackathons={hackathons}
                tasks={kanbanTasks}
                deadlines={deadlines}
                onNavigateView={setCurrentView}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onLoadSampleData={handleLoadSampleData}
                onCreateHackathon={() => setCurrentView('hackathon-board')}
              />
            )}

            {currentView === 'hackathon-board' && (
              <HackathonBoardView
                hackathons={hackathons}
                teamMembers={teamMembers}
                onAddHackathon={handleAddHackathon}
                onUpdateHackathon={handleUpdateHackathon}
                onDeleteHackathon={handleDeleteHackathon}
              />
            )}

            {currentView === 'kanban' && (
              <KanbanBoardView
                tasks={kanbanTasks}
                teamMembers={teamMembers}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
                onOpenGitHubSync={() => setCurrentView('github-sync')}
                onOpenGoogleTasks={() => setCurrentView('google-tasks')}
              />
            )}

            {currentView === 'github-sync' && (
              <GitHubSyncView
                onSyncToKanban={handleAddTask}
                onSyncToStandup={handleAddStandup}
                existingTasks={kanbanTasks}
              />
            )}

            {currentView === 'google-tasks' && (
              <GoogleTasksView
                kanbanTasks={kanbanTasks}
                onAddKanbanTask={handleAddTask}
              />
            )}

            {currentView === 'team' && (
              <TeamWorkspaceView
                teamMembers={teamMembers}
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                currentUserRole={userRole}
                rolePermissions={rolePermissions}
                onSavePermissions={handleSavePermissions}
              />
            )}

            {currentView === 'ai-idea' && (
              <AIIdeaGeneratorView
                onSaveAsNote={handleAddNote}
                onAddHackathon={handleAddHackathon}
              />
            )}

            {currentView === 'ai-ppt' && (
              <AIPptGeneratorView hackathons={hackathons} />
            )}

            {currentView === 'ai-readme' && (
              <AIReadmeGeneratorView hackathons={hackathons} />
            )}

            {currentView === 'ai-pitch' && (
              <AIPitchGeneratorView hackathons={hackathons} />
            )}

            {currentView === 'ai-eval' && (
              <AIProjectEvaluationView hackathons={hackathons} />
            )}

            {currentView === 'ai-judge' && (
              <AIJudgeSimulatorView hackathons={hackathons} />
            )}

            {currentView === 'ai-reviewer' && <AICodeReviewerView />}

            {currentView === 'document-center' && (
              <DocumentCenterView
                documents={documents}
                hackathons={hackathons}
                milestones={milestones}
                expenses={expenses}
                teamMembers={teamMembers}
                tasks={kanbanTasks}
                standups={standups}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                onAddNotification={handleAddNotification}
              />
            )}

            {currentView === 'timeline' && (
              <TimelineView
                milestones={milestones}
                onToggleStatus={handleToggleMilestone}
                onAddMilestone={handleAddMilestone}
              />
            )}

            {currentView === 'progress-ring' && <ProgressRingView />}

            {currentView === 'standups' && (
              <DailyStandupView
                standups={standups}
                teamMembers={teamMembers}
                onAddStandup={handleAddStandup}
              />
            )}

            {currentView === 'deadlines' && (
              <DeadlineCountdownView
                deadlines={deadlines}
                onAddDeadline={handleAddDeadline}
              />
            )}

            {currentView === 'notes' && (
              <NotesView
                notes={notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
              />
            )}

            {currentView === 'resources' && (
              <ResourceLibraryView
                resources={resources}
                onAddResource={handleAddResource}
                onDeleteResource={handleDeleteResource}
              />
            )}

            {currentView === 'expenses' && (
              <ExpenseTrackerView
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {currentView === 'achievements' && (
              <AchievementView
                achievements={achievements}
                onAddAchievement={handleAddAchievement}
                onDeleteAchievement={handleDeleteAchievement}
              />
            )}

            {currentView === 'calendar' && (
              <CalendarView hackathons={hackathons} />
            )}

            {currentView === 'analytics' && (
              <AnalyticsView
                hackathons={hackathons}
                achievements={achievements}
                expenses={expenses}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(viewId) => setCurrentView(viewId as any)}
      />
    </div>
  );
}

export default App;
