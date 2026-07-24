import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  ExternalLink,
  Github,
  Figma,
  Folder,
  Send,
  Users,
  Search,
  Calendar,
  DollarSign,
  Building,
  Clock,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { HackathonItem, HackathonStatus, TeamMember } from '../types';

interface HackathonBoardViewProps {
  hackathons: HackathonItem[];
  teamMembers: TeamMember[];
  onAddHackathon: (hackathon: HackathonItem) => void;
  onUpdateHackathon: (hackathon: HackathonItem) => void;
  onDeleteHackathon?: (id: string) => void;
}

export const HackathonBoardView: React.FC<HackathonBoardViewProps> = ({
  hackathons,
  teamMembers,
  onAddHackathon,
  onUpdateHackathon,
  onDeleteHackathon,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HackathonItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<HackathonStatus>('Registered');
  const [formDaysLeft, setFormDaysLeft] = useState(7);
  const [formPrizePool, setFormPrizePool] = useState('$10,000 Prize');
  const [formOrganizer, setFormOrganizer] = useState('TechCorp');
  const [formWebsiteLink, setFormWebsiteLink] = useState('https://devfolio.co');
  const [formGithub, setFormGithub] = useState('https://github.com/team/app');
  const [formFigma, setFormFigma] = useState('https://figma.com');
  const [formDrive, setFormDrive] = useState('https://drive.google.com');
  const [formSubmissionLink, setFormSubmissionLink] = useState('https://devfolio.co/submit');
  const [formDescription, setFormDescription] = useState('');

  const statusBadge = (status: HackathonStatus) => {
    switch (status) {
      case 'Registered':
        return { label: 'Registered', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'Building':
        return { label: 'Building', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'Submitted':
        return { label: 'Submitted', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'Won':
        return { label: 'Won', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
      case 'Lost':
        return { label: 'Lost', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    }
  };

  const filtered = hackathons.filter((h) => {
    const matchesStatus = filterStatus === 'ALL' || h.status === filterStatus;
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.organizer.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      const updated: HackathonItem = {
        ...editingItem,
        name: formName,
        status: formStatus,
        daysLeft: Number(formDaysLeft),
        prizePool: formPrizePool,
        organizer: formOrganizer,
        websiteLink: formWebsiteLink,
        github: formGithub,
        figma: formFigma,
        drive: formDrive,
        submissionLink: formSubmissionLink,
        description: formDescription,
      };
      onUpdateHackathon(updated);
      setEditingItem(null);
    } else {
      const newItem: HackathonItem = {
        id: `h_${Date.now()}`,
        name: formName,
        status: formStatus,
        daysLeft: Number(formDaysLeft),
        deadlineDate: new Date(Date.now() + formDaysLeft * 24 * 3600 * 1000).toISOString(),
        prizePool: formPrizePool,
        organizer: formOrganizer,
        websiteLink: formWebsiteLink,
        teamMemberIds: ['m1', 'm2', 'm3'],
        github: formGithub,
        figma: formFigma,
        drive: formDrive,
        submissionLink: formSubmissionLink,
        bannerColor: 'from-blue-600/30 to-indigo-900/40',
        description: formDescription || 'Hackathon project description',
        domainProgress: { ui: 10, backend: 10, database: 10, testing: 0 },
      };
      onAddHackathon(newItem);
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormStatus('Registered');
    setFormDaysLeft(7);
    setFormPrizePool('$10,000 Prize');
    setFormOrganizer('TechCorp');
    setFormWebsiteLink('https://devfolio.co');
    setFormGithub('https://github.com');
    setFormFigma('https://figma.com');
    setFormDrive('https://drive.google.com');
    setFormSubmissionLink('https://devfolio.co');
    setFormDescription('');
  };

  const openEditModal = (h: HackathonItem) => {
    setEditingItem(h);
    setFormName(h.name);
    setFormStatus(h.status);
    setFormDaysLeft(h.daysLeft);
    setFormPrizePool(h.prizePool);
    setFormOrganizer(h.organizer);
    setFormWebsiteLink(h.websiteLink);
    setFormGithub(h.github);
    setFormFigma(h.figma);
    setFormDrive(h.drive);
    setFormSubmissionLink(h.submissionLink);
    setFormDescription(h.description);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-4 text-[#fafafa] font-sans pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#fafafa]">
              Hackathon Board
            </h1>
          </div>
          <p className="text-xs text-[#71717a] mt-0.5">
            Centralized register of all ongoing, submitted, and upcoming hackathons.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingItem(null);
            setShowAddModal(true);
          }}
          className="px-3 py-1.5 text-xs font-bold rounded bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Hackathon</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 p-2 rounded-lg bg-[#18181b] border border-[#27272a]">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
          {['ALL', 'Registered', 'Building', 'Submitted', 'Won', 'Lost'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-[#09090b] text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              {st === 'ALL' ? 'All Hackathons' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-60">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search hackathons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const badge = statusBadge(item.status);
          const assignedMembers = teamMembers.filter((m) => item.teamMemberIds?.includes(m.id));

          return (
            <div
              key={item.id}
              className="bg-[#18181b] border border-[#27272a] hover:border-blue-500/40 rounded-lg p-4 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div>
                {/* Title & Status Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-sm font-bold text-[#fafafa] flex items-center gap-1.5">
                      {item.name}
                      <a
                        href={item.websiteLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#71717a] hover:text-blue-400"
                        title="Website"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </h2>
                    <p className="text-[11px] text-[#71717a] flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-[#52525b]" />
                      <span>{item.organizer}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {onDeleteHackathon && (
                      <button
                        onClick={() => onDeleteHackathon(item.id)}
                        className="p-1 rounded bg-[#09090b] hover:bg-red-500/20 text-[#a1a1aa] hover:text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#a1a1aa] mb-3 line-clamp-2 leading-relaxed">{item.description}</p>

                {/* Details Pill */}
                <div className="grid grid-cols-2 gap-2 mb-3 p-2 rounded bg-[#09090b] border border-[#27272a] text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#a1a1aa]">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span>Time Remaining:</span>
                    <strong className="text-[#fafafa] font-mono">{item.daysLeft}d</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#a1a1aa]">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Prize Pool:</span>
                    <strong className="text-emerald-400 font-mono">{item.prizePool}</strong>
                  </div>
                </div>

                {/* Team Assigned */}
                {assignedMembers.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] uppercase font-semibold text-[#52525b] block mb-1">
                      Assigned Members:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                      {assignedMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#09090b] border border-[#27272a] text-[10px] text-[#fafafa]"
                        >
                          <img src={m.avatar} alt={m.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                          <span>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resource Buttons */}
              <div className="pt-2 border-t border-[#27272a] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-[#09090b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={item.figma}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-[#09090b] hover:bg-[#27272a] text-purple-400 hover:text-purple-300"
                    title="Figma"
                  >
                    <Figma className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={item.drive}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-[#09090b] hover:bg-[#27272a] text-amber-400 hover:text-amber-300"
                    title="Drive"
                  >
                    <Folder className="w-3.5 h-3.5" />
                  </a>
                </div>

                <a
                  href={item.submissionLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Submission Portal</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#18181b] border border-[#27272a] rounded-lg w-full max-w-lg p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 text-[#71717a] hover:text-[#fafafa]"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-sm font-bold text-[#fafafa] mb-3">
              {editingItem ? 'Edit Hackathon Record' : 'Register New Hackathon'}
            </h2>

            <form onSubmit={handleSaveForm} className="space-y-3">
              <div>
                <label className="block text-[#a1a1aa] mb-1 font-medium">Hackathon Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NexGen AI Challenge"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as HackathonStatus)}
                    className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Registered">Registered</option>
                    <option value="Building">Building</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium">Days Remaining</label>
                  <input
                    type="number"
                    value={formDaysLeft}
                    onChange={(e) => setFormDaysLeft(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium">Prize Pool</label>
                  <input
                    type="text"
                    value={formPrizePool}
                    onChange={(e) => setFormPrizePool(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[#a1a1aa] mb-1 font-medium">Organizer</label>
                  <input
                    type="text"
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[#fafafa] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a1a1aa] mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
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
                  className="px-3 py-1.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
