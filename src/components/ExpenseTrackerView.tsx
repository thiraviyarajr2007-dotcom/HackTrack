import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, CheckCircle2, Clock, X, TrendingUp } from 'lucide-react';
import { ExpenseItem } from '../types';

interface ExpenseTrackerViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseTrackerView: React.FC<ExpenseTrackerViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formCategory, setFormCategory] = useState<'Domain' | 'API' | 'Travel' | 'Food' | 'Swag' | 'Other'>('Domain');
  const [formAmount, setFormAmount] = useState(500);
  const [formNotes, setFormNotes] = useState('');

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const categoryTotals = expenses.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formAmount <= 0) return;

    const newExpense: ExpenseItem = {
      id: `exp_${Date.now()}`,
      hackathonId: 'h1',
      category: formCategory,
      amount: Number(formAmount),
      currency: '₹',
      notes: formNotes || `${formCategory} expense`,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
    };

    onAddExpense(newExpense);
    setShowAdd(false);
    setFormNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">12️⃣ Expense Tracker</h1>
          </div>
          <p className="text-xs text-slate-400">
            Track hackathon operational budget: Domain registrations, API credits, travel, and food.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Expense Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Total Hackathon Budget Spent</span>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">₹{totalSpent}</div>
        </div>

        {['Domain', 'API', 'Travel', 'Food'].map((cat) => (
          <div key={cat} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-xs font-semibold text-slate-400">{cat} Expenses</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">
              ₹{categoryTotals[cat] || 0}
            </div>
          </div>
        ))}
      </div>

      {/* Expense List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            All Expense Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Notes / Purpose</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold text-purple-400">{exp.category}</td>
                  <td className="px-4 py-3 text-slate-200">{exp.notes}</td>
                  <td className="px-4 py-3 font-bold text-emerald-400 font-mono">
                    {exp.currency}
                    {exp.amount}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{exp.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        exp.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-4">Log Expense</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Domain">Domain (₹500)</option>
                    <option value="API">API (₹1000)</option>
                    <option value="Travel">Travel (₹1200)</option>
                    <option value="Food">Food (₹600)</option>
                    <option value="Swag">Swag</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notes / Description</label>
                <input
                  type="text"
                  placeholder="e.g. hacktrack.dev domain registration"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
