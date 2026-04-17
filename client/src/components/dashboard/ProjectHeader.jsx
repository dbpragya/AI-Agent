import React from 'react';
import { Edit3, Share2, Play, ChevronDown, ArrowLeft } from 'lucide-react';

const ProjectHeader = ({ project, onRefineClick, onBack }) => {
  return (
    <header className="h-16 shrink-0 border-b border-white/5 bg-surface/50 backdrop-blur-md px-6 md:px-8 flex items-center justify-between z-10 w-full text-zinc-100">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors hidden sm:block"
          title="Back to Dashboard"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5 cursor-pointer hover:border-white/10 transition-colors group">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-medium text-zinc-300 truncate max-w-[150px] sm:max-w-[300px]">
            {project?.name || 'Project: Comrade Ai'}
          </span>
          <ChevronDown size={14} className="text-zinc-600 group-hover:text-zinc-400" />
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
          <span>Staging_Active</span>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <span>v1.2.4</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-medium">
          <Share2 size={16} />
          Export
        </button>
        
        <button 
          onClick={onRefineClick}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-zinc-200 transition-all text-sm font-medium group"
        >
          <Edit3 size={16} className="text-cyan-500 transition-transform group-hover:scale-110" />
          Refine Brief
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          <Play size={16} fill="currentColor" />
          Deploy
        </button>
      </div>
    </header>
  );
};

export default ProjectHeader;
