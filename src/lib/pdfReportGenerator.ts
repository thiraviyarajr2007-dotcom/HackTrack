import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  TimelineMilestone,
  ExpenseItem,
  TeamMember,
  TaskItem,
  DailyStandupItem,
} from '../types';

export interface PDFReportOptions {
  title: string;
  hackathonName: string;
  executiveSummary?: string;
  includeMilestones: boolean;
  includeExpenses: boolean;
  includeTeamContributions: boolean;
  includeTasks: boolean;
  milestones: TimelineMilestone[];
  expenses: ExpenseItem[];
  teamMembers: TeamMember[];
  tasks: TaskItem[];
  standups: DailyStandupItem[];
  generatedBy?: string;
}

export function generateProjectPDFReport(options: PDFReportOptions): {
  doc: jsPDF;
  filename: string;
  blobUrl: string;
} {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [88, 28, 135]; // Deep Purple #581c87
  const textColor = [30, 41, 59]; // Slate 800
  const lightBg = [248, 250, 252]; // Slate 50

  let currentY = 15;

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PROJECT SUBMISSION & SUMMARY REPORT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    14,
    22
  );

  currentY = 36;

  // Project Info Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 28, 2, 2, 'FD');

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Project / Hackathon: ${options.hackathonName}`, 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Report Title: ${options.title}`, 18, currentY + 13);
  doc.text(`Prepared By: ${options.generatedBy || 'HackTrack Lead'}`, 18, currentY + 19);
  doc.text(`Status: Verified for External Submission`, 115, currentY + 13);
  doc.text(`Audit State: Complete Workspace Sync`, 115, currentY + 19);

  currentY += 34;

  // Executive Summary (if provided)
  if (options.executiveSummary && options.executiveSummary.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Executive Overview', 14, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const splitSummary = doc.splitTextToSize(options.executiveSummary, 182);
    doc.text(splitSummary, 14, currentY);
    currentY += splitSummary.length * 4.5 + 6;
  }

  // Section 1: Milestones
  if (options.includeMilestones) {
    if (currentY > 235) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('1. Project Milestones & Timeline Progress', 14, currentY);
    currentY += 4;

    const milestoneRows = options.milestones.map((m) => [
      `Day ${m.dayNumber}: ${m.dayTitle}`,
      m.date || 'N/A',
      m.status,
      m.description || '-',
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Milestone Title', 'Target Date', 'Status', 'Description']],
      body:
        milestoneRows.length > 0
          ? milestoneRows
          : [['No milestones recorded', '-', '-', '-']],
      theme: 'grid',
      headStyles: {
        fillColor: [88, 28, 135],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 82 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section 2: Budget & Expenses
  if (options.includeExpenses) {
    if (currentY > 225) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('2. Financial Overview & Expense Breakdown', 14, currentY);
    currentY += 4;

    const totalSpent = options.expenses.reduce(
      (sum, e) => sum + (e.amount || 0),
      0
    );
    const approvedSpent = options.expenses
      .filter((e) => e.status === 'Approved')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const expenseRows = options.expenses.map((e) => [
      e.category,
      e.notes || e.category,
      `${e.currency || '₹'} ${e.amount.toLocaleString()}`,
      e.date,
      e.status,
    ]);

    expenseRows.push([
      'TOTAL OUTLAY',
      `Approved: ₹ ${approvedSpent.toLocaleString()}`,
      `₹ ${totalSpent.toLocaleString()}`,
      '-',
      '-',
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Category', 'Description / Notes', 'Amount', 'Date', 'Status']],
      body:
        expenseRows.length > 0
          ? expenseRows
          : [['No expenses recorded', '-', '₹ 0', '-', '-']],
      theme: 'grid',
      headStyles: {
        fillColor: [88, 28, 135],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 65 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 27 },
      },
      didParseCell: (data) => {
        if (
          data.row.index === expenseRows.length - 1 &&
          expenseRows.length > 1
        ) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [243, 232, 255];
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section 3: Team Contributions
  if (options.includeTeamContributions) {
    if (currentY > 225) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('3. Team Contributions & Member Performance', 14, currentY);
    currentY += 4;

    const teamRows = options.teamMembers.map((m) => {
      const memberTasks = options.tasks.filter(
        (t) => t.assignedMemberId === m.id
      );
      const completedTasks = memberTasks.filter(
        (t) => t.status === 'Completed'
      ).length;
      const standupCount = options.standups.filter(
        (s) => s.memberId === m.id
      ).length;

      return [
        m.name,
        m.role,
        m.specialty || 'Full Stack',
        `${memberTasks.length} Assigned / ${completedTasks} Done`,
        `${m.completionPercentage || 0}%`,
        `${standupCount} updates`,
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [
        ['Member Name', 'Role', 'Specialty', 'Task Ratio', 'Progress', 'Standups'],
      ],
      body:
        teamRows.length > 0
          ? teamRows
          : [['No team members listed', '-', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: {
        fillColor: [88, 28, 135],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Section 4: Tasks
  if (options.includeTasks && options.tasks.length > 0) {
    if (currentY > 225) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('4. Deliverables & Task Log', 14, currentY);
    currentY += 4;

    const taskRows = options.tasks.map((t) => {
      const assignee =
        options.teamMembers.find((m) => m.id === t.assignedMemberId)?.name ||
        'Unassigned';
      return [t.title, t.priority, t.status, assignee, t.dueDate || 'N/A'];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Task Title', 'Priority', 'Status', 'Assignee', 'Due Date']],
      body: taskRows,
      theme: 'grid',
      headStyles: {
        fillColor: [88, 28, 135],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Footer for pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `HackTrack Submission Summary Report - Page ${i} of ${totalPages}`,
      14,
      287
    );
    doc.text(`Official Document for External Review`, 140, 287);
  }

  const cleanName = (options.hackathonName || 'Project').replace(/\s+/g, '_');
  const filename = `${cleanName}_Submission_Report.pdf`;
  const blobUrl = doc.output('bloburl');

  return {
    doc,
    filename,
    blobUrl:
      typeof blobUrl === 'string'
        ? blobUrl
        : URL.createObjectURL(blobUrl as any),
  };
}
