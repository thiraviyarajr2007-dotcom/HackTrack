import React, { useState } from 'react';
import {
  FileText,
  X,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  FolderCheck,
  Building2,
  Users,
  DollarSign,
  Flag,
  CheckSquare,
  Maximize2,
} from 'lucide-react';
import {
  DocumentItem,
  HackathonItem,
  TimelineMilestone,
  ExpenseItem,
  TeamMember,
  TaskItem,
  DailyStandupItem,
} from '../types';
import { generateProjectPDFReport } from '../lib/pdfReportGenerator';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface PDFReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathons: HackathonItem[];
  milestones: TimelineMilestone[];
  expenses: ExpenseItem[];
  teamMembers: TeamMember[];
  tasks: TaskItem[];
  standups: DailyStandupItem[];
  onAddDocument: (doc: DocumentItem) => void;
}

export const PDFReportGeneratorModal: React.FC<PDFReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  hackathons,
  milestones,
  expenses,
  teamMembers,
  tasks,
  standups,
  onAddDocument,
}) => {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>('all');
  const [reportTitle, setReportTitle] = useState(
    'External Submission & Project Audit Summary'
  );
  const [preparedBy, setPreparedBy] = useState('Team Leader');
  const [executiveSummary, setExecutiveSummary] = useState(
    'This project submission report summarizes our key engineering milestones, complete financial expenditure, and individual team member contributions. All code deliverables and presentation materials have been compiled for sponsor evaluation.'
  );

  const [includeMilestones, setIncludeMilestones] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const [includeTeam, setIncludeTeam] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [generatedDocObj, setGeneratedDocObj] = useState<any>(null);
  const [savedToDocsMsg, setSavedToDocsMsg] = useState<string | null>(null);
  const [isPreviewOverlayOpen, setIsPreviewOverlayOpen] = useState(false);

  if (!isOpen) return null;

  const targetHackathon =
    selectedHackathonId === 'all'
      ? null
      : hackathons.find((h) => h.id === selectedHackathonId);

  const filterHackathonName = targetHackathon
    ? targetHackathon.name
    : 'All Active Hackathons';

  const filteredMilestones = selectedHackathonId === 'all'
    ? milestones
    : milestones.filter((m) => m.hackathonId === selectedHackathonId);

  const filteredExpenses = selectedHackathonId === 'all'
    ? expenses
    : expenses.filter((e) => e.hackathonId === selectedHackathonId);

  const filteredTasks = selectedHackathonId === 'all'
    ? tasks
    : tasks.filter((t) => t.hackathonId === selectedHackathonId);

  const handleGeneratePDF = () => {
    setSavedToDocsMsg(null);
    const result = generateProjectPDFReport({
      title: reportTitle,
      hackathonName: filterHackathonName,
      executiveSummary,
      includeMilestones,
      includeExpenses,
      includeTeamContributions: includeTeam,
      includeTasks,
      milestones: filteredMilestones,
      expenses: filteredExpenses,
      teamMembers,
      tasks: filteredTasks,
      standups,
      generatedBy: preparedBy,
    });

    setGeneratedDocObj(result.doc);
    setPdfFileName(result.filename);
    setPdfPreviewUrl(result.blobUrl);
  };

  const handleDownload = () => {
    if (!generatedDocObj) {
      handleGeneratePDF();
      return;
    }
    generatedDocObj.save(pdfFileName || 'Project_Submission_Report.pdf');
  };

  const handleSaveToDocumentCenter = () => {
    if (!generatedDocObj) {
      handleGeneratePDF();
    }

    const newDoc: DocumentItem = {
      id: `pdf_report_${Date.now()}`,
      title: `${filterHackathonName} - ${reportTitle}.pdf`,
      hackathonId: selectedHackathonId === 'all' ? (hackathons[0]?.id || 'h1') : selectedHackathonId,
      type: 'PDF',
      url: pdfPreviewUrl || '#',
      size: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: preparedBy || 'Team Lead',
    };

    onAddDocument(newDoc);
    setSavedToDocsMsg('PDF report successfully added to Document Center assets!');
    setTimeout(() => {
      setSavedToDocsMsg(null);
    }, 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative text-xs text-slate-100 max-h-[92vh] overflow-y-auto custom-scrollbar cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Generate External Submission PDF Report
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                PDF Export
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Compile project milestones, expenses, and team contributions into a professional PDF document for judges & sponsors.
            </p>
          </div>
        </div>

        {/* Form Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Left Column: Project Scope & Info */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                Target Project / Hackathon
              </label>
              <select
                value={selectedHackathonId}
                onChange={(e) => {
                  setSelectedHackathonId(e.target.value);
                  setPdfPreviewUrl(null);
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">🌐 All Projects / Workspace Combined</option>
                {hackathons.map((h) => (
                  <option key={h.id} value={h.id}>
                    🏆 {h.name} ({h.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Report Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => {
                  setReportTitle(e.target.value);
                  setPdfPreviewUrl(null);
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="e.g. Final Submission & Financial Audit Report"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Prepared By (Lead / Author)
              </label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => {
                  setPreparedBy(e.target.value);
                  setPdfPreviewUrl(null);
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Executive Overview Note
              </label>
              <textarea
                rows={3}
                value={executiveSummary}
                onChange={(e) => {
                  setExecutiveSummary(e.target.value);
                  setPdfPreviewUrl(null);
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Brief summary notes for external submission..."
              />
            </div>
          </div>

          {/* Right Column: Content Checkboxes & Included Metrics */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <p className="text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Sections to Include
              </p>

              <div className="space-y-2">
                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeMilestones}
                    onChange={(e) => {
                      setIncludeMilestones(e.target.checked);
                      setPdfPreviewUrl(null);
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600 w-4 h-4"
                  />
                  <div className="flex items-center space-x-2">
                    <Flag className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <p className="font-bold text-slate-200">1. Project Milestones</p>
                      <p className="text-[10px] text-slate-400">
                        {filteredMilestones.length} milestones ({filteredMilestones.filter((m) => m.status === 'Completed').length} completed)
                      </p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeExpenses}
                    onChange={(e) => {
                      setIncludeExpenses(e.target.checked);
                      setPdfPreviewUrl(null);
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600 w-4 h-4"
                  />
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <p className="font-bold text-slate-200">2. Budget & Expense Summary</p>
                      <p className="text-[10px] text-slate-400">
                        {filteredExpenses.length} expense logs (Total: ₹{' '}
                        {filteredExpenses
                          .reduce((s, e) => s + (e.amount || 0), 0)
                          .toLocaleString()}
                        )
                      </p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeTeam}
                    onChange={(e) => {
                      setIncludeTeam(e.target.checked);
                      setPdfPreviewUrl(null);
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600 w-4 h-4"
                  />
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <p className="font-bold text-slate-200">3. Team Member Contributions</p>
                      <p className="text-[10px] text-slate-400">
                        {teamMembers.length} active members with task completion ratios
                      </p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={includeTasks}
                    onChange={(e) => {
                      setIncludeTasks(e.target.checked);
                      setPdfPreviewUrl(null);
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600 w-4 h-4"
                  />
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <p className="font-bold text-slate-200">4. Deliverables & Kanban Log</p>
                      <p className="text-[10px] text-slate-400">
                        {filteredTasks.length} tasks recorded across statuses
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeneratePDF}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer mt-2"
            >
              <Eye className="w-4 h-4" />
              <span>Generate / Refresh PDF Document</span>
            </button>
          </div>
        </div>

        {/* PDF Preview Frame if generated */}
        {pdfPreviewUrl && (
          <div className="mb-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live PDF Report Generated: <span className="text-purple-400">{pdfFileName}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOverlayOpen(true)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Interactive Preview</span>
              </button>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 h-80 relative shadow-inner group">
              <iframe
                src={pdfPreviewUrl}
                title="PDF Submission Report Preview"
                className="w-full h-full border-none"
              />
              <button
                type="button"
                onClick={() => setIsPreviewOverlayOpen(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 shadow-xl flex items-center gap-1.5 backdrop-blur-sm cursor-pointer transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Full Screen Preview</span>
              </button>
            </div>
          </div>
        )}

        {savedToDocsMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <FolderCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedToDocsMsg}</span>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer w-full sm:w-auto text-xs"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (!pdfPreviewUrl) {
                  handleGeneratePDF();
                }
                setIsPreviewOverlayOpen(true);
              }}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-amber-500/30 flex items-center justify-center space-x-1.5 cursor-pointer text-xs"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview PDF Report</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToDocumentCenter}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold border border-purple-500/30 flex items-center justify-center space-x-1.5 cursor-pointer text-xs"
            >
              <FolderCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Save to Assets</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Interactive Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewOverlayOpen}
        onClose={() => setIsPreviewOverlayOpen(false)}
        pdfUrl={pdfPreviewUrl}
        title={reportTitle}
        hackathonName={filterHackathonName}
        onDownload={handleDownload}
      />
    </div>
  );
};
