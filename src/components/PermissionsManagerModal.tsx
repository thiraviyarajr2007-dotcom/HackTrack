import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  X,
  Crown,
  UserCheck,
  GraduationCap,
  Save,
  Loader2,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import { RolePermissions, UserRole } from '../types';

export interface PermissionsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: RolePermissions;
  onSavePermissions: (updated: RolePermissions, rulesCode: string) => Promise<void>;
  currentUserRole?: UserRole;
}

export const PermissionsManagerModal: React.FC<PermissionsManagerModalProps> = ({
  isOpen,
  onClose,
  permissions,
  onSavePermissions,
  currentUserRole = 'Team Leader',
}) => {
  const [localPermissions, setLocalPermissions] = useState<RolePermissions>(permissions);
  const [activeTab, setActiveTab] = useState<'matrix' | 'rules'>('matrix');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLeader = currentUserRole === 'Team Leader';

  const toggleMemberPermission = (key: keyof RolePermissions['member']) => {
    if (!isLeader) return;
    setLocalPermissions((prev) => ({
      ...prev,
      member: {
        ...prev.member,
        [key]: !prev.member[key],
      },
    }));
  };

  const toggleMentorPermission = (key: keyof RolePermissions['mentor']) => {
    if (!isLeader) return;
    setLocalPermissions((prev) => ({
      ...prev,
      mentor: {
        ...prev.mentor,
        [key]: !prev.mentor[key],
      },
    }));
  };

  const generateFirestoreRules = (perms: RolePermissions) => {
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Workspace Role-Based Rules
    match /workspaces/{userId} {
      // Team Leader (Workspace Owner) has full Administrative Access
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Member Access Rules
      match /tasks/{taskId} {
        allow read: if request.auth != null;
        allow create, update: if request.auth != null && ${perms.member.canEditTasks};
        allow delete: if request.auth != null && ${perms.member.canDeleteTasks};
      }
      match /documents/{docId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && ${perms.member.canUploadDocuments};
      }
      match /expenses/{expenseId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && ${perms.member.canLogExpenses};
      }
      match /standups/{standupId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && ${perms.member.canSubmitStandups};
      }

      // Mentor Access Rules
      match /evaluations/{evalId} {
        allow read: if request.auth != null && ${perms.mentor.canViewWorkspace};
        allow write: if request.auth != null && ${perms.mentor.canCreateReviews};
      }
    }

    // Default Fallback Authentication Access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;
  };

  const rulesCode = generateFirestoreRules(localPermissions);

  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setSaveSuccessMsg(null);
    try {
      await onSavePermissions(localPermissions, rulesCode);
      setSaveSuccessMsg('Permissions & Firestore security rules updated and deployed!');
      setTimeout(() => {
        setSaveSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to deploy permissions:', err);
      setSaveSuccessMsg('Failed to update permissions: ' + (err?.message || 'Error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden font-sans text-xs flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272a] bg-[#09090b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#fafafa]">Team Permissions Manager</h2>
              <p className="text-[11px] text-[#71717a]">
                Configure fine-grained read/write access for Members & Mentors and update Firestore Security Rules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isLeader && (
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Read Only (Leader Only)
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#27272a] bg-[#18181b]">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matrix'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-[#71717a] hover:text-[#fafafa]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Role Permissions Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rules'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-[#71717a] hover:text-[#fafafa]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Generated Firestore Security Rules</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {saveSuccessMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {activeTab === 'matrix' ? (
            <div className="space-y-6">
              {/* Team Leader Badge */}
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#fafafa]">Team Leader (Administrator)</h3>
                    <p className="text-[11px] text-[#a1a1aa]">
                      Full Unrestricted Read & Write Access across all workspace modules and settings.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">
                  ALL PERMISSIONS ENABLED
                </span>
              </div>

              {/* Member Permissions Toggles */}
              <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <UserCheck className="w-4 h-4" />
                    <span>Member Access Controls</span>
                  </div>
                  <span className="text-[10px] text-[#71717a]">Developers & Designers</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[
                    {
                      key: 'canCreateTasks',
                      title: 'Create & Add Kanban Tasks',
                      desc: 'Allow members to create new tasks in Kanban board',
                    },
                    {
                      key: 'canEditTasks',
                      title: 'Update & Drag Kanban Tasks',
                      desc: 'Allow members to update task status and details',
                    },
                    {
                      key: 'canDeleteTasks',
                      title: 'Delete Kanban Tasks',
                      desc: 'Allow members to remove tasks from Kanban board',
                    },
                    {
                      key: 'canUploadDocuments',
                      title: 'Upload PPT, APK & Documents',
                      desc: 'Allow members to upload files to Document Center',
                    },
                    {
                      key: 'canLogExpenses',
                      title: 'Log Expense Items',
                      desc: 'Allow members to add items to Expense Tracker',
                    },
                    {
                      key: 'canSubmitStandups',
                      title: 'Submit Daily Standups',
                      desc: 'Allow members to log daily standup reports',
                    },
                    {
                      key: 'canEditHackathons',
                      title: 'Edit Hackathon Details',
                      desc: 'Allow members to edit hackathon links & progress',
                    },
                  ].map((item) => {
                    const isEnabled = localPermissions.member[item.key as keyof RolePermissions['member']];
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleMemberPermission(item.key as keyof RolePermissions['member'])}
                        className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                          isLeader ? 'cursor-pointer hover:border-blue-500/40' : 'opacity-80'
                        } ${
                          isEnabled
                            ? 'bg-blue-500/10 border-blue-500/30 text-[#fafafa]'
                            : 'bg-[#18181b] border-[#27272a] text-[#71717a]'
                        }`}
                      >
                        <div className="pr-3">
                          <p className="font-semibold text-xs flex items-center gap-1.5">
                            {isEnabled ? (
                              <Unlock className="w-3.5 h-3.5 text-blue-400" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-[#71717a]" />
                            )}
                            {item.title}
                          </p>
                          <p className="text-[10px] text-[#71717a] mt-0.5">{item.desc}</p>
                        </div>
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                            isEnabled ? 'bg-blue-600 justify-end' : 'bg-[#27272a] justify-start'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mentor Permissions Toggles */}
              <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <GraduationCap className="w-4 h-4" />
                    <span>Mentor Access Controls</span>
                  </div>
                  <span className="text-[10px] text-[#71717a]">Advisors & Evaluators</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[
                    {
                      key: 'canViewWorkspace',
                      title: 'View Workspace & Roadmap',
                      desc: 'Allow mentors full read access to workspace timelines',
                    },
                    {
                      key: 'canCreateReviews',
                      title: 'Run AI Judge & Code Reviews',
                      desc: 'Allow mentors to evaluate projects and write feedback',
                    },
                    {
                      key: 'canEditTasks',
                      title: 'Edit & Move Kanban Tasks',
                      desc: 'Allow mentors to update task status (default: read-only)',
                    },
                    {
                      key: 'canManageMembers',
                      title: 'Manage Team Member Roles',
                      desc: 'Allow mentors to adjust member specialties',
                    },
                    {
                      key: 'canSubmitProject',
                      title: 'Submit Final Hackathon Build',
                      desc: 'Allow mentors to execute final hackathon submission',
                    },
                  ].map((item) => {
                    const isEnabled = localPermissions.mentor[item.key as keyof RolePermissions['mentor']];
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleMentorPermission(item.key as keyof RolePermissions['mentor'])}
                        className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                          isLeader ? 'cursor-pointer hover:border-amber-500/40' : 'opacity-80'
                        } ${
                          isEnabled
                            ? 'bg-amber-500/10 border-amber-500/30 text-[#fafafa]'
                            : 'bg-[#18181b] border-[#27272a] text-[#71717a]'
                        }`}
                      >
                        <div className="pr-3">
                          <p className="font-semibold text-xs flex items-center gap-1.5">
                            {isEnabled ? (
                              <Unlock className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-[#71717a]" />
                            )}
                            {item.title}
                          </p>
                          <p className="text-[10px] text-[#71717a] mt-0.5">{item.desc}</p>
                        </div>
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                            isEnabled ? 'bg-amber-600 justify-end' : 'bg-[#27272a] justify-start'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#fafafa] flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-400" /> Live Generated firestore.rules
                </span>
                <span className="text-[10px] text-[#71717a] font-mono">Enforces Role Security on Firebase Cloud</span>
              </div>

              <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl font-mono text-[11px] text-purple-300 leading-relaxed overflow-x-auto custom-scrollbar">
                <pre>{rulesCode}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#27272a] bg-[#09090b] flex items-center justify-between">
          <p className="text-[11px] text-[#71717a]">
            {isLeader
              ? 'Changes will immediately sync to Firestore Database & update security rules.'
              : 'Only Team Leaders can modify team permission policies.'}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] font-semibold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>

            {isLeader && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Deploying Rules...' : 'Save & Deploy Rules'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
