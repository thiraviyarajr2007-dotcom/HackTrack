export type UserRole = 'Team Leader' | 'Member' | 'Mentor';

export interface RolePermissions {
  member: {
    canCreateTasks: boolean;
    canEditTasks: boolean;
    canDeleteTasks: boolean;
    canUploadDocuments: boolean;
    canLogExpenses: boolean;
    canSubmitStandups: boolean;
    canEditHackathons: boolean;
  };
  mentor: {
    canViewWorkspace: boolean;
    canCreateReviews: boolean;
    canEditTasks: boolean;
    canManageMembers: boolean;
    canSubmitProject: boolean;
  };
}

export interface GitHubCommitItem {
  sha: string;
  commitMessage: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  htmlUrl: string;
  branch: string;
  syncedToKanban?: boolean;
  syncedToStandup?: boolean;
}

export interface GitHubSyncConfig {
  connected: boolean;
  username: string;
  repoOwner: string;
  repoName: string;
  branch: string;
  autoSync: boolean;
  lastSyncedAt?: string;
  personalToken?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'Google' | 'GitHub' | 'Email';
  createdAt: string;
  role: UserRole;
}

export type HackathonStatus = 'Registered' | 'Building' | 'Submitted' | 'Won' | 'Lost';

export interface HackathonItem {
  id: string;
  name: string;
  status: HackathonStatus;
  daysLeft: number;
  deadlineDate: string;
  prizePool: string;
  organizer: string;
  websiteLink: string;
  teamMemberIds: string[];
  github: string;
  figma: string;
  drive: string;
  submissionLink: string;
  bannerColor: string;
  description: string;
  domainProgress: {
    ui: number;
    backend: number;
    database: number;
    testing: number;
  };
}

export type KanbanStatus = 'To Do' | 'In Progress' | 'Testing' | 'Submitted' | 'Completed';

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: KanbanStatus;
  hackathonId: string;
  assignedMemberId: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  subtasks: Subtask[];
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: UserRole;
  specialty: string;
  avatar: string;
  assignedTaskCount: number;
  completionPercentage: number;
  lastActive: string;
  email: string;
  bio: string;
}

export type DocumentType = 'PPT' | 'PDF' | 'ZIP' | 'APK' | 'Image' | 'Demo Videos';

export interface DocumentItem {
  id: string;
  title: string;
  hackathonId: string;
  type: DocumentType;
  url: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface TimelineMilestone {
  id: string;
  hackathonId: string;
  dayNumber: number;
  dayTitle: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  date: string;
}

export interface DailyStandupItem {
  id: string;
  date: string;
  memberId: string;
  memberName: string;
  memberRole: string;
  memberAvatar: string;
  yesterday: string;
  today: string;
  blockers: string;
  timestamp: string;
}

export interface DeadlineTimer {
  id: string;
  hackathonId: string;
  hackathonName: string;
  title: string;
  targetDate: string; // ISO string
  category: 'Submission' | 'PPT' | 'Demo' | 'Registration' | 'Mentoring';
}

export interface NoteItem {
  id: string;
  hackathonId: string;
  title: string;
  content: string;
  category: 'Quick Notes' | 'Meeting Minutes' | 'Judge Questions' | 'Feedback';
  date: string;
  tags: string[];
}

export interface ResourceItem {
  id: string;
  hackathonId: string;
  title: string;
  url: string;
  category: 'GitHub' | 'YouTube' | 'Research Papers' | 'Documentation' | 'Figma';
  description: string;
  addedBy: string;
}

export interface ExpenseItem {
  id: string;
  hackathonId: string;
  category: 'Domain' | 'API' | 'Travel' | 'Food' | 'Swag' | 'Other';
  amount: number;
  currency: string;
  notes: string;
  date: string;
  status: 'Approved' | 'Pending';
}

export interface AchievementItem {
  id: string;
  hackathonName: string;
  type: 'Winner' | 'Runner Up' | 'Top 10' | 'Participation';
  prizeWon: string;
  certificateUrl: string;
  date: string;
  description: string;
  badgeColor: string;
}

export interface CalendarEvent {
  id: string;
  hackathonId: string;
  hackathonName: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'Registration' | 'Mentoring' | 'Submission' | 'Presentation' | 'Final Results';
  color: string;
}

export interface NotificationItem {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'timer' | 'user' | 'file' | 'team' | 'trophy';
}

export interface AIIdeaResult {
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  architecture: string;
  businessModel: string;
  pptOutline: string[];
}
