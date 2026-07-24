import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Building2,
  Calendar,
  User,
  Sparkles,
  Printer,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { DocumentItem, TeamMember, NotificationItem } from '../types';
import { EmailReportModal } from './EmailReportModal';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
  pdfUrl?: string | null;
  title?: string;
  hackathonName?: string;
  teamMembers?: TeamMember[];
  onDownload?: () => void;
  onAddNotification?: (notification: NotificationItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
  pdfUrl,
  title,
  hackathonName,
  teamMembers = [],
  onDownload,
  onAddNotification,
}) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!isOpen) return null;

  const displayTitle = title || document?.title || 'Project Report Document';
  const displayHackathon = hackathonName || 'Hackathon Workspace';
  const previewSource = pdfUrl || document?.url;
  const isPdfType =
    (document?.type === 'PDF' || pdfUrl || displayTitle.toLowerCase().endsWith('.pdf'));

  const handlePrint = () => {
    if (previewSource && previewSource !== '#') {
      const win = window.open(previewSource, '_blank');
      if (win) {
        win.focus();
        win.print();
      }
    } else {
      window.print();
    }
  };

  const handleDownloadFile = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (document?.url && document.url !== '#') {
      const a = window.document.createElement('a');
      a.href = document.url;
      a.download = document.title;
      a.click();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden text-slate-100 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:px-6 sm:py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  {displayTitle}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                  {document?.type || 'PDF PREVIEW'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1 text-purple-400 font-medium">
                  <Building2 className="w-3 h-3" />
                  {displayHackathon}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {document?.uploadedBy || 'Team Author'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {document?.uploadDate || new Date().toISOString().split('T')[0]}
                </span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0 ml-2">
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/50 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Send Automated Email to Team"
            >
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Email Team</span>
            </button>

            {previewSource && previewSource !== '#' && (
              <button
                onClick={handlePrint}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}

            {previewSource && previewSource !== '#' && (
              <a
                href={previewSource}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={handleDownloadFile}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar with Document Verification Badge */}
        <div className="px-6 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">Verified HackTrack Artifact</span>
            <span className="text-slate-600">|</span>
            <span>Interactive PDF Document Viewer</span>
          </div>
          <div className="flex items-center space-x-3 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              Sponsor Ready
            </span>
            <span>Size: {document?.size || '1.8 MB'}</span>
          </div>
        </div>

        {/* Main Document Content Viewer */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden relative">
          {previewSource && previewSource !== '#' ? (
            <iframe
              src={previewSource}
              title={displayTitle}
              className="w-full h-full border border-slate-800 rounded-xl bg-slate-900 shadow-inner"
            />
          ) : (
            <div className="w-full h-full border border-slate-800 rounded-xl bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
              <div className="p-4 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-400 mb-4">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{displayTitle}</h3>
              <p className="text-xs text-slate-400 max-w-md mb-6">
                This document asset is ready for submission and export. You can review metadata or download the complete file below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-6 text-left">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Document Type</p>
                  <p className="text-xs font-bold text-purple-300 mt-0.5">{document?.type || 'PDF'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Project Scope</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 truncate">{displayHackathon}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">File Size</p>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">{document?.size || '1.8 MB'}</p>
                </div>
              </div>

              <button
                onClick={handleDownloadFile}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Document File</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            External Submission PDF & Assets Preview Mode
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/50 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Send Email Dispatch</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>

      {/* Automated Email Report Trigger Modal */}
      <EmailReportModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        reportTitle={displayTitle}
        hackathonName={displayHackathon}
        pdfUrl={previewSource}
        teamMembers={teamMembers}
        onAddNotification={onAddNotification}
      />
    </div>
  );
};
