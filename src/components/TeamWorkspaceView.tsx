import React, { useState } from 'react';
import { motion } from 'motion/react';
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
    <div className="space-y-6 text-[#fafafa] font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-black tracking-tight text-white">
              Team Workspace & Permissions
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage team roles, invite links, task assignments, and permission controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <span className="text-xs text-slate-400 font-mono">Role:</span>
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-indigo-400" />
            {currentUserRole}
          </span>

          <button
            onClick={() => setShowPermissionsModal(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-indigo-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Permissions Manager</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Role Permissions Matrix Card */}
      <div className="glass-card rounded-[20px] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-xs font-heading font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" /> HackTrack Role & Permissions Hierarchy
          </span>
          <button
            onClick={() => setShowPermissionsModal(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Configure Permissions & Rules</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Team Leader */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold font-heading">
              <Crown className="w-4 h-4 text-indigo-400" />
              <span>Team Leader</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Full administrative control over project lifecycle and settings.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Assign & reassign tasks to members</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Manage hackathon settings & deadlines</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Generate & manage invite codes</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Submit final project builds</li>
            </ul>
          </div>

          {/* Member */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-bold font-heading">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Team Member</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Active project developer and design contributor.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Create & update task statuses</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Drag Kanban cards across workflow</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Upload PPT, APK, Code & Files</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Submit daily standups & notes</li>
            </ul>
          </div>

          {/* Mentor */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-heading">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Mentor</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Guidance, code reviews, and strategic evaluation.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-1.5 text-emerald-400">✓ View project details & Kanban roadmap</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Run AI Rubric project evaluations</li>
              <li className="flex items-center gap-1.5 text-emerald-400">✓ Leave mentor feedback & guidance notes</li>
              <li className="flex items-center gap-1.5 text-amber-400">⚠ Read-only task editing access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Join Team & Invite Code Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Leader Invite Code Generation */}
        <div className="glass-card rounded-[20px] p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="font-bold text-slate-100 flex items-center gap-2 font-heading">
              <Key className="w-4 h-4 text-indigo-400" /> Invite Code Generator
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">Team Leader Tool</span>
          </div>

          <p className="text-slate-400 text-xs">
            Generate a unique code to invite teammates directly to your hackathon workspace.
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl font-mono font-bold text-center text-indigo-400 tracking-wider">
              {generatedInviteCode}
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleGenerateCode}
              className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-mono rounded-xl cursor-pointer transition-colors"
              title="Generate New Code"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Member Join Code Entry */}
        <div className="glass-card rounded-[20px] p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="font-bold text-slate-100 flex items-center gap-2 font-heading">
              <UserPlus className="w-4 h-4 text-indigo-400" /> Join Team via Code
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Member Onboarding</span>
          </div>

          <p className="text-slate-400 text-xs">
            Have an invite code from your Team Leader? Enter it below to join this workspace.
          </p>

          <form onSubmit={handleJoinByCode} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. HT-2026-X99Z"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer transition-colors"
            >
              Join
            </button>
          </form>

          {joinStatusMsg && (
            <div
              className={`p-2.5 rounded-xl text-[11px] font-mono border ${
                joinStatusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {joinStatusMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -3 }}
            className="glass-card rounded-[20px] p-4 flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Avatar & Role Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-700/80 shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-xl border ${
                      member.role === 'Team Leader'
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                        : member.role === 'Mentor'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                    }`}
                  >
                    {member.role}
                  </span>

                  <button
                    onClick={() => openEdit(member)}
                    className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit Member"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Name & Specialty */}
              <h3 className="text-sm font-bold text-white font-heading">{member.name}</h3>
              <p className="text-xs text-indigo-400 font-medium mb-1.5">{member.specialty}</p>
              <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{member.bio}</p>

              {/* Task Metrics */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 mb-3 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Assigned Tasks:</span>
                  <strong className="text-white font-mono">{member.assignedTaskCount}</strong>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                    <span>Task Completion:</span>
                    <strong className="text-emerald-400 font-mono">{member.completionPercentage}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${member.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email & Activity */}
            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 truncate max-w-[130px]">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{member.email}</span>
              </span>
              <span className="font-mono text-slate-500">{member.lastActive}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Form */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-xs cursor-default space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-white font-heading">
              {editingMember ? 'Edit Team Member Profile' : 'Add Team Member'}
            </h2>

            <form onSubmit={handleSaveMember} className="space-y-3.5">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Patel"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Team Leader">Team Leader</option>
                    <option value="Member">Member</option>
                    <option value="Mentor">Mentor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack / UI Lead"
                    value={formSpecialty}
                    onChange={(e) => setFormSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="ananya@hacktrack.io"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Member technical focus and contributions..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMember}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:from-indigo-500 hover:to-violet-500 cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-600/25"
                >
                  {isSavingMember && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                  <span>{isSavingMember ? 'Saving...' : 'Save Profile'}</span>
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

