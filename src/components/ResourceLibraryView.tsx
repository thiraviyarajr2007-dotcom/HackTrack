import React, { useState } from 'react';
import {
  Bookmark,
  Plus,
  Search,
  ExternalLink,
  Github,
  Youtube,
  FileText,
  BookOpen,
  Figma,
  Trash2,
  X,
} from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourceLibraryViewProps {
  resources: ResourceItem[];
  onAddResource: (res: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
}

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  resources,
  onAddResource,
  onDeleteResource,
}) => {
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCat, setFormCat] = useState<'GitHub' | 'YouTube' | 'Research Papers' | 'Documentation' | 'Figma'>('GitHub');
  const [formDesc, setFormDesc] = useState('');

  const getCatIcon = (cat: string) => {
    switch (cat) {
      case 'GitHub':
        return <Github className="w-4 h-4 text-slate-300" />;
      case 'YouTube':
        return <Youtube className="w-4 h-4 text-rose-400" />;
      case 'Research Papers':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'Documentation':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'Figma':
        return <Figma className="w-4 h-4 text-amber-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-purple-400" />;
    }
  };

  const filtered = resources.filter((r) => {
    const matchesCat = filterCat === 'ALL' || r.category === filterCat;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    const newItem: ResourceItem = {
      id: `res_${Date.now()}`,
      hackathonId: 'h1',
      title: formTitle,
      url: formUrl,
      category: formCat,
      description: formDesc || 'Reference link asset',
      addedBy: 'Rahul Sharma',
    };

    onAddResource(newItem);
    setShowAdd(false);
    setFormTitle('');
    setFormUrl('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">11️⃣ Resource Library</h1>
          </div>
          <p className="text-xs text-slate-400">
            Bookmark repository for GitHub projects, YouTube guides, Research papers, API documentation & Figma designs.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Save Resource Link</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
          {['ALL', 'GitHub', 'YouTube', 'Research Papers', 'Documentation', 'Figma'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterCat === c
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 shadow-md flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {getCatIcon(res.category)}
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                  {res.category}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">{res.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{res.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">By {res.addedBy}</span>

              <div className="flex items-center space-x-1">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-semibold flex items-center space-x-1"
                >
                  <span>Open Link</span> <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => onDeleteResource(res.id)}
                  className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-500 hover:text-rose-400 cursor-pointer"
                  title="Delete resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
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

            <h2 className="text-base font-bold text-white mb-4">Save Resource Link</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gemini 3.6 Flash SDK Documentation"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={formCat}
                  onChange={(e) => setFormCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                >
                  <option value="GitHub">GitHub</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Research Papers">Research Papers</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Figma">Figma</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Quick summary of why this resource is helpful..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
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
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
