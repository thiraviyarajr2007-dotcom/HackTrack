import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Shield,
  ShieldCheck,
  Edit2,
  X,
  Key,
  Copy,
  Check,
  UserPlus,
  Crown,
  UserCheck,
  GraduationCap,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';
import { TeamMember, UserRole, RolePermissions } from '../types';
import { PermissionsManagerModal } from './PermissionsManagerModal';

interface TeamWorkspaceViewProps {
  teamMembers: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onUpdateMember: (member: TeamMember) => void;
  currentUserRole?: UserRole;
  rolePermissions?: RolePermissions;
  onSavePermissions?: (updated: RolePermissions, rulesCode: string) => Promise<void>;
}

export const TeamWorkspaceView: React.FC<TeamWorkspaceViewProps> = ({
  teamMembers,
  onAddMember,
  onUpdateMember,
  currentUserRole = 'Team Leader',
  rolePermissions,
  onSavePermissions,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const activePermissions: RolePermissions = rolePermissions || {
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
  };

  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('Member');
  const [formSpecialty, setFormSpecialty] = useState('Full Stack');
  const [formEmail, setFormEmail] = useState('');
  const [formBio, setFormBio] = useState('');
  const [isSavingMember, setIsSavingMember] = useState(false);

  // Join Team Algorithm state
  const [generatedInviteCode, setGeneratedInviteCode] = useState('HT-2026-X99Z');
  const [copiedCode, setCopiedCode] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinStatusMsg, setJoinStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'HT-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedInviteCode(code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedInviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    // Check code validity (e.g. HT- prefix or matches generated)
    if (joinCodeInput.trim().toUpperCase().startsWith('HT-') || joinCodeInput.trim() === generatedInviteCode) {
      const newMember: TeamMember = {
        id: `m_${Date.now()}`,
        name: 'New Joined Member',
        role: 'Member',
        specialty: 'Contributor',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        assignedTaskCount: 0,
        completionPercentage: 0,
        lastActive: 'Just now',
        email: 'joined.member@hacktrack.io',
        bio: `Joined via Invite Code ${joinCodeInput.toUpperCase()}`,
      };
      onAddMember(newMember);
      setJoinStatusMsg({
        text: `Successfully joined team with invite code ${joinCodeInput.toUpperCase()}! Role assigned: Member.`,
        type: 'success',
      });
      setJoinCodeInput('');
    } else {
      setJoinStatusMsg({
        text: 'Invalid Invite Code. Please check the code provided by your Team Leader.',
        type: 'error',
      });
    }

    setTimeout(() => setJoinStatusMsg(null), 4000);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || isSavingMember) return;

    setIsSavingMember(true);
    try {
      if (editingMember) {
        const updated: TeamMember = {
          ...editingMember,
          name: formName,
          role: formRole,
          specialty: formSpecialty,
          email: formEmail,
          bio: formBio,
        };
        await onUpdateMember(updated);
      } else {
        const newMember: TeamMember = {
          id: `m_${Date.now()}`,
          name: formName,
          role: formRole,
          specialty: formSpecialty,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
          assignedTaskCount: 2,
          completionPercentage: 25,
          lastActive: 'Just now',
          email: formEmail || `${formName.toLowerCase().replace(/\s+/g, '.')}@hacktrack.io`,
          bio: formBio || 'Hackathon team contributor.',
        };
        await onAddMember(newMember);
      }

      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save member:', err);
    } finally {
      setIsSavingMember(false);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormRole('Member');
    setFormSpecialty('Full Stack');
    setFormEmail('');
    setFormBio('');
    setEditingMember(null);
  };

  const openEdit = (m: TeamMember) => {
    setEditingMember(m);
    setFormName(m.name);
    setFormRole(m.role);
    setFormSpecialty(m.specialty);
    setFormEmail(m.email);
    setFormBio(m.bio);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-4 text-[#fafafa] font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#fafafa]">
              Team Workspace & Permissions
            </h1>
          </div>
          <p className="text-xs text-[#71717a] mt-0.5">
            Role definitions, invite code generation, member task pacing, and collaboration metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] text-[#71717a] font-mono">Your Role:</span>
          <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            {currentUserRole}
          </span>

          <button
            onClick={() => setShowPermissionsModal(true)}
            className="px-3 py-1.5 text-xs font-bold rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Open Permissions Manager"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Permissions Manager</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Role Permissions Matrix Card */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
          <span className="text-xs font-bold uppercase text-[#71717a] tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" /> HackTrack Role & Permissions Hierarchy
          </span>
          <button
            onClick={() => setShowPermissionsModal(true)}
            className="text-[10px] text-purple-400 hover:text-purple-300 font-mono underline flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Configure Permissions & Firestore Rules</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Team Leader */}
          <div className="p-3 rounded bg-[#09090b] border border-[#27272a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold">
              <Crown className="w-4 h-4 text-purple-400" />
              <span>Team Leader</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              Full administrative control over project lifecycle.
            </p>
            <ul className="text-[10px] text-[#71717a] space-y-1 pt-1 border-t border-[#27272a]">
              <li className="flex items-center gap-1 text-emerald-400">✓ Assign & reassign tasks to members</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Manage hackathon settings & deadlines</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Generate & manage invite codes</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Submit final project builds</li>
            </ul>
          </div>

          {/* Member */}
          <div className="p-3 rounded bg-[#09090b] border border-[#27272a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-300 font-bold">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Team Member</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              Execution and active project development.
            </p>
            <ul className="text-[10px] text-[#71717a] space-y-1 pt-1 border-t border-[#27272a]">
              <li className="flex items-center gap-1 text-emerald-400">✓ Create & update task statuses</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Drag Kanban cards across progress columns</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Upload PPT, APK, Code & Files</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Submit daily standups & notes</li>
            </ul>
          </div>

          {/* Mentor */}
          <div className="p-3 rounded bg-[#09090b] border border-[#27272a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Mentor</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              Guidance, code reviews, and strategic evaluation.
            </p>
            <ul className="text-[10px] text-[#71717a] space-y-1 pt-1 border-t border-[#27272a]">
              <li className="flex items-center gap-1 text-emerald-400">✓ View project details & Kanban roadmap</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Run AI Rubric project evaluations</li>
              <li className="flex items-center gap-1 text-emerald-400">✓ Leave mentor feedback & guidance notes</li>
              <li className="flex items-center gap-1 text-amber-400">⚠ Read-only task editing access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Join Team & Invite Code Section (Algorithm #3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Leader Invite Code Generation */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
            <span className="font-bold text-[#fafafa] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" /> Invite Code Generator (Team Leader)
            </span>
            <span className="text-[10px] text-[#71717a]">Algorithm #3</span>
          </div>

          <p className="text-[#a1a1aa]">
            Leaders can generate shareable 6-digit codes to invite members to the hackathon project team.
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded font-mono font-bold text-center text-blue-400 tracking-wider">
              {generatedInviteCode}
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] font-bold rounded flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleGenerateCode}
              className="px-2.5 py-1.5 bg-[#09090b] hover:bg-[#27272a] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] font-mono rounded cursor-pointer"
              title="Generate New Code"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Member Join Code Entry */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
            <span className="font-bold text-[#fafafa] flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-purple-400" /> Join Team via Invite Code
            </span>
            <span className="text-[10px] text-[#71717a]">Member Onboarding</span>
          </div>

          <p className="text-[#a1a1aa]">
            Have an invite code from your leader? Enter it below to join the hackathon workspace instantly.
          </p>

          <form onSubmit={handleJoinByCode} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Code e.g. HT-2026-X99Z"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] font-mono uppercase focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded cursor-pointer"
            >
              Join Workspace
            </button>
          </form>

          {joinStatusMsg && (
            <div
              className={`p-2 rounded text-[11px] font-mono border ${
                joinStatusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {joinStatusMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-[#18181b] border border-[#27272a] hover:border-blue-500/40 rounded-lg p-3.5 flex flex-col justify-between transition-colors group"
          >
            <div>
              {/* Avatar & Role Badge */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#18181b]" />
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                      member.role === 'Team Leader'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                        : member.role === 'Mentor'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                    }`}
                  >
                    {member.role}
                  </span>

                  <button
                    onClick={() => openEdit(member)}
                    className="p-1 rounded bg-[#09090b] text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit Member"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Name & Specialty */}
              <h3 className="text-xs font-bold text-[#fafafa]">{member.name}</h3>
              <p className="text-[11px] text-blue-400 font-medium mb-1.5">{member.specialty}</p>
              <p className="text-[11px] text-[#a1a1aa] mb-2.5 line-clamp-2 leading-tight">{member.bio}</p>

              {/* Task Metrics */}
              <div className="p-2 rounded bg-[#09090b] border border-[#27272a] space-y-1.5 mb-2.5 text-[11px]">
                <div className="flex justify-between items-center text-[#a1a1aa]">
                  <span>Assigned Tasks:</span>
                  <strong className="text-[#fafafa] font-mono">{member.assignedTaskCount}</strong>
                </div>

                <div>
                  <div className="flex justify-between text-[#71717a] text-[10px] mb-0.5">
                    <span>Task Completion:</span>
                    <strong className="text-emerald-400 font-mono">{member.completionPercentage}%</strong>
                  </div>
                  <div className="w-full h-1 bg-[#27272a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${member.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email & Activity */}
            <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[10px] text-[#71717a]">
              <span className="flex items-center gap-1 truncate max-w-[130px]">
                <Mail className="w-3 h-3 text-[#52525b]" />
                <span className="truncate">{member.email}</span>
              </span>
              <span className="font-mono text-[#52525b]">{member.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#18181b] border border-[#27272a] rounded-lg w-full max-w-md p-5 shadow-2xl relative text-xs cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 text-[#71717a] hover:text-[#fafafa]"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-sm font-bold text-[#fafafa] mb-3">
              {editingMember ? 'Edit Team Member Profile' : 'Add Team Member'}
            </h2>

            <form onSubmit={handleSaveMember} className="space-y-3">
              <div>
                <label className="block text-[#a1a1aa] mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Patel"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Team Leader">Team Leader</option>
                    <option value="Member">Member</option>
                    <option value="Mentor">Mentor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium">Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack / UI Lead"
                    value={formSpecialty}
                    onChange={(e) => setFormSpecialty(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="ananya@hacktrack.io"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1 font-medium">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Member technical focus and contributions..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-[#27272a] text-[#fafafa] hover:bg-[#3f3f46] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMember}
                  className="px-3.5 py-1.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                >
                  {isSavingMember && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-200" />}
                  <span>{isSavingMember ? 'Saving...' : 'Save Member Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Manager Modal */}
      <PermissionsManagerModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        permissions={activePermissions}
        onSavePermissions={async (updated, rulesCode) => {
          if (onSavePermissions) {
            await onSavePermissions(updated, rulesCode);
          }
        }}
        currentUserRole={currentUserRole}
      />
    </div>
  );
};
