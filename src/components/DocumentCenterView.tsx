import React, { useState } from 'react';
import {
  FolderArchive,
  UploadCloud,
  FileText,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  Video,
  Presentation,
  Download,
  Trash2,
  Search,
  Plus,
  X,
  ExternalLink,
  Sparkles,
  Award,
  Eye,
} from 'lucide-react';
import {
  DocumentItem,
  DocumentType,
  HackathonItem,
  TimelineMilestone,
  ExpenseItem,
  TeamMember,
  TaskItem,
  DailyStandupItem,
} from '../types';
import { PDFReportGeneratorModal } from './PDFReportGeneratorModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface DocumentCenterViewProps {
  documents: DocumentItem[];
  hackathons: HackathonItem[];
  milestones?: TimelineMilestone[];
  expenses?: ExpenseItem[];
  teamMembers?: TeamMember[];
  tasks?: TaskItem[];
  standups?: DailyStandupItem[];
  onAddDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (docId: string) => void;
}

export const DocumentCenterView: React.FC<DocumentCenterViewProps> = ({
  documents,
  hackathons,
  milestones = [],
  expenses = [],
  teamMembers = [],
  tasks = [],
  standups = [],
  onAddDocument,
  onDeleteDocument,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<DocumentType>('PPT');
  const [formHackathonId, setFormHackathonId] = useState('h1');
  const [formSize, setFormSize] = useState('12.4 MB');

  const getDocIcon = (type: DocumentType) => {
    switch (type) {
      case 'PPT':
        return <Presentation className="w-5 h-5 text-amber-400" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'ZIP':
        return <FileArchive className="w-5 h-5 text-purple-400" />;
      case 'APK':
        return <FileCode className="w-5 h-5 text-emerald-400" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-cyan-400" />;
      case 'Demo Videos':
        return <Video className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: formTitle,
      hackathonId: formHackathonId,
      type: formType,
      url: '#',
      size: formSize,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Rahul Sharma',
    };

    onAddDocument(newDoc);
    setShowUploadModal(false);
    setFormTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FolderArchive className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">5️⃣ Document Center</h1>
          </div>
          <p className="text-xs text-slate-400">
            Store presentation slides, PDFs, code ZIPs, APK builds, design images, and demo videos in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Generate PDF Submission Report</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File / Asset</span>
          </button>
        </div>
      </div>

      {/* Quick Action PDF Feature Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              External Submission & Compliance Report
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PDF Ready
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instantly export an official PDF summary report containing all project milestones, financial expense logs, and team contribution metrics for sponsors & hackathon judges.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer transition-all self-end md:self-auto"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Submission PDF</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
          {['ALL', 'PPT', 'PDF', 'ZIP', 'APK', 'Image', 'Demo Videos'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const hackathon = hackathons.find((h) => h.id === doc.hackathonId);

          return (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 shadow-md flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getDocIcon(doc.type)}
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {doc.type}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">{doc.title}</h3>
                <p className="text-[11px] text-purple-400 font-semibold mb-3">
                  Hackathon: {hackathon?.name || 'HackNova 2026'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.uploadedBy}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-950 text-purple-300 hover:text-purple-200 cursor-pointer transition-all"
                    title="Preview Document / Report"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <a
                    href={doc.url}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload File Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-4">Upload Document or Asset</h2>

            {/* Drag and Drop Zone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-6 text-center bg-slate-950/60 mb-4 cursor-pointer transition-all">
              <UploadCloud className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-semibold text-slate-200">Drag & Drop file here or click to browse</p>
              <p className="text-[10px] text-slate-500 mt-1">Supports PPT, PDF, ZIP, APK, MP4, PNG up to 100MB</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Final Pitch Slides Deck.pdf"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Document Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as DocumentType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="PPT">PPT Presentation</option>
                    <option value="PDF">PDF File</option>
                    <option value="ZIP">ZIP Code Source</option>
                    <option value="APK">APK Android Build</option>
                    <option value="Image">Design Image</option>
                    <option value="Demo Videos">Demo Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Hackathon</label>
                  <select
                    value={formHackathonId}
                    onChange={(e) => setFormHackathonId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    {hackathons.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">File Size</label>
                <input
                  type="text"
                  value={formSize}
                  onChange={(e) => setFormSize(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Report Generator Modal */}
      <PDFReportGeneratorModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        hackathons={hackathons}
        milestones={milestones}
        expenses={expenses}
        teamMembers={teamMembers}
        tasks={tasks}
        standups={standups}
        onAddDocument={onAddDocument}
      />

      {/* Document Asset Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        hackathonName={
          hackathons.find((h) => h.id === previewDoc?.hackathonId)?.name
        }
      />
    </div>
  );
};
