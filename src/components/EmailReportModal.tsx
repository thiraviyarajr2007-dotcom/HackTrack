import React, { useState } from 'react';
import {
  Mail,
  X,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileText,
  UserCheck,
  Users,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Paperclip,
  AlertCircle,
  Check,
} from 'lucide-react';
import { TeamMember, NotificationItem } from '../types';

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  hackathonName: string;
  pdfUrl?: string | null;
  teamMembers: TeamMember[];
  onAddNotification?: (notification: NotificationItem) => void;
}

export interface EmailDispatchLog {
  id: string;
  sentAt: string;
  reportTitle: string;
  hackathonName: string;
  leaderName: string;
  recipientsCount: number;
  recipientEmails: string[];
  status: 'Delivered';
}

export const EmailReportModal: React.FC<EmailReportModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  hackathonName,
  pdfUrl,
  teamMembers,
  onAddNotification,
}) => {
  const [leaderConfirmed, setLeaderConfirmed] = useState(true);
  const [leaderName, setLeaderName] = useState('Sabankumar (Team Leader)');
  
  // Select all member emails by default
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    teamMembers.map((m) => m.id)
  );

  const [extraEmails, setExtraEmails] = useState<string[]>([
    'sponsor-reviews@hackathon.org',
  ]);
  const [newExtraInput, setNewExtraInput] = useState('');

  const [emailSubject, setEmailSubject] = useState(
    `[Final Submission PDF] ${hackathonName} - Verified & Approved Report`
  );
  const [emailBody, setEmailBody] = useState(
    `Hello Team,\n\nThe finalized project report for ${hackathonName} ("${reportTitle}") has been reviewed, confirmed, and approved by the Team Leader.\n\nPlease find the official PDF report attached to this message for external submission and sponsor evaluation.\n\nBest regards,\n${leaderName}`
  );

  const [isSending, setIsSending] = useState(false);
  const [sendingStep, setSendingStep] = useState(0);
  const [dispatchLogs, setDispatchLogs] = useState<EmailDispatchLog[]>([]);
  const [lastSentSuccess, setLastSentSuccess] = useState<EmailDispatchLog | null>(
    null
  );

  if (!isOpen) return null;

  const handleToggleMember = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((mId) => mId !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMemberIds.length === teamMembers.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(teamMembers.map((m) => m.id));
    }
  };

  const handleAddExtraEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraInput.trim()) return;
    if (!newExtraInput.includes('@')) return;
    setExtraEmails([...extraEmails, newExtraInput.trim()]);
    setNewExtraInput('');
  };

  const handleRemoveExtraEmail = (email: string) => {
    setExtraEmails(extraEmails.filter((e) => e !== email));
  };

  const getRecipientEmails = (): string[] => {
    const memberEmails = teamMembers
      .filter((m) => selectedMemberIds.includes(m.id))
      .map((m) => m.email || `${m.name.toLowerCase().replace(/\s+/g, '')}@hacktrack.dev`);
    return Array.from(new Set([...memberEmails, ...extraEmails]));
  };

  const recipientEmails = getRecipientEmails();

  const handleSendAutomatedEmail = () => {
    if (!leaderConfirmed) return;
    if (recipientEmails.length === 0) return;

    setIsSending(true);
    setSendingStep(1);

    setTimeout(() => {
      setSendingStep(2);
      setTimeout(() => {
        setSendingStep(3);
        setTimeout(() => {
          setIsSending(false);
          setSendingStep(0);

          const newLog: EmailDispatchLog = {
            id: `email_${Date.now()}`,
            sentAt: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }) + ', ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            reportTitle,
            hackathonName,
            leaderName,
            recipientsCount: recipientEmails.length,
            recipientEmails,
            status: 'Delivered',
          };

          setDispatchLogs([newLog, ...dispatchLogs]);
          setLastSentSuccess(newLog);

          if (onAddNotification) {
            onAddNotification({
              id: `notif_${Date.now()}`,
              text: `Automated Email Trigger: PDF report "${reportTitle}" dispatched to ${recipientEmails.length} team email addresses by ${leaderName}.`,
              timestamp: 'Just now',
              read: false,
              type: 'file',
            });
          }
        }, 800);
      }, 700);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative text-xs text-slate-100 max-h-[92vh] overflow-y-auto custom-scrollbar cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-400 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Automated Email Dispatch - PDF Report
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                Team Sync
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Send the finalized PDF report to registered team email addresses & external reviewers upon Team Leader confirmation.
            </p>
          </div>
        </div>

        {/* Success Banner if recently dispatched */}
        {lastSentSuccess && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-200 flex items-start space-x-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-emerald-300">
                  Automated Email Dispatched Successfully!
                </h4>
                <span className="text-[10px] text-emerald-400">{lastSentSuccess.sentAt}</span>
              </div>
              <p className="text-[11px] text-emerald-300/90 mt-1">
                The report <span className="font-bold text-white">"{lastSentSuccess.reportTitle}"</span> has been delivered to <span className="font-bold text-white">{lastSentSuccess.recipientsCount} registered email recipient(s)</span>.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lastSentSuccess.recipientEmails.map((email, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700/50 text-[10px] font-mono text-emerald-200"
                  >
                    ✓ {email}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setLastSentSuccess(null)}
              className="text-emerald-400 hover:text-emerald-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Team Leader Confirmation Verification Box */}
        <div className="p-4 mb-5 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-950 to-slate-950 border border-purple-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-700/40 text-purple-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-white text-xs">Team Leader Preview & Sign-off</p>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Required Action
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Confirm preview verification before triggering automated team dispatch.
              </p>
            </div>
          </div>

          <label className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-purple-500 transition-all shrink-0">
            <input
              type="checkbox"
              checked={leaderConfirmed}
              onChange={(e) => setLeaderConfirmed(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600 w-4 h-4"
            />
            <span className="font-bold text-slate-200 text-xs">Confirmed by Team Leader</span>
          </label>
        </div>

        {/* Form Body Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Left Column: Recipients Selection */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Registered Team Recipients ({selectedMemberIds.length}/{teamMembers.length})
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
              >
                {selectedMemberIds.length === teamMembers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Team Members List */}
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {teamMembers.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                const emailStr =
                  member.email ||
                  `${member.name.toLowerCase().replace(/\s+/g, '')}@hacktrack.dev`;

                return (
                  <label
                    key={member.id}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-800/60 text-slate-100'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleMember(member.id)}
                        className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600 w-3.5 h-3.5 shrink-0"
                      />
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full border border-slate-700 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[11px] truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{emailStr}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0 ml-2">
                      {member.role}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Extra Recipients Input */}
            <div className="pt-2 border-t border-slate-800">
              <p className="font-bold text-slate-300 text-[11px] mb-1.5">
                Additional External Email Recipients
              </p>
              <form onSubmit={handleAddExtraEmail} className="flex space-x-2 mb-2">
                <input
                  type="email"
                  value={newExtraInput}
                  onChange={(e) => setNewExtraInput(e.target.value)}
                  placeholder="e.g. mentor@sponsor.org"
                  className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5">
                {extraEmails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-purple-300"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtraEmail(email)}
                      className="hover:text-red-400 cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Email Content Configuration */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Message Body
                </label>
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans"
                />
              </div>

              {/* PDF Attachment Indicator */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Paperclip className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-200 text-[11px] truncate">
                      {reportTitle}.pdf
                    </p>
                    <p className="text-[10px] text-slate-400">{hackathonName} • 1.8 MB PDF Report</p>
                  </div>
                </div>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-[10px] font-semibold cursor-pointer shrink-0"
                  >
                    View File
                  </a>
                )}
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/30 flex items-center justify-between text-[11px] text-purple-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Target Recipients:
              </span>
              <span className="font-bold text-white">{recipientEmails.length} Email Addresses</span>
            </div>
          </div>
        </div>

        {/* Progress Spinner if Sending */}
        {isSending && (
          <div className="mb-5 p-4 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-xs">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                Dispatching Automated Email Trigger...
              </span>
              <span>Step {sendingStep} of 3</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-300"
                style={{ width: `${(sendingStep / 3) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-300">
              {sendingStep === 1 && '1. Validating Team Leader sign-off signature...'}
              {sendingStep === 2 && '2. Attaching generated PDF report artifact...'}
              {sendingStep === 3 && `3. Delivering emails to ${recipientEmails.length} registered address(es)...`}
            </p>
          </div>
        )}

        {/* Past Dispatch Logs if any */}
        {dispatchLogs.length > 0 && (
          <div className="mb-5 space-y-2">
            <p className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Automated Email Dispatch History
            </p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
              {dispatchLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-slate-200">{log.reportTitle}</span>
                      <span className="text-slate-400 ml-2">({log.recipientsCount} recipients)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{log.sentAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-xs"
          >
            Close
          </button>

          <button
            type="button"
            disabled={!leaderConfirmed || recipientEmails.length === 0 || isSending}
            onClick={handleSendAutomatedEmail}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer ${
              !leaderConfirmed || recipientEmails.length === 0 || isSending
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed shadow-none'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {isSending ? 'Dispatching Emails...' : 'Send Automated Email to Team'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
