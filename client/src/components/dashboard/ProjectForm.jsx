import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

const ProjectForm = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    story: ''
  });
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    // Simulate generation delay
    onSubmit({
      id: `proj_${Date.now()}`,
      name: formData.name,
      story: formData.story,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="max-w-2xl mx-auto w-full"
    >
      <button 
        onClick={onCancel}
        className="mb-8 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors group px-2 py-1 rounded-md hover:bg-white/5"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <div className="glass-card p-8 border-white/5 bg-zinc-900/60 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Zap size={16} className="text-cyan-500" />
            </div>
            Initialize New Project
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Provide core parameters for neural agent generation phase.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 px-1">Project Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter Project name"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-zinc-100 outline-none focus:border-cyan-500/60 transition-all shadow-inner placeholder:text-zinc-700"
              required
            />
          </div>

          {/* User Story */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 px-1">User Story</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <textarea 
                value={formData.story}
                onChange={(e) => setFormData({...formData, story: e.target.value})}
                placeholder="Upload user story... Describe the application, target audience, and primary features"
                className="relative w-full min-h-[160px] bg-zinc-950 border border-white/10 rounded-xl p-4 font-mono text-sm text-zinc-200 outline-none focus:border-cyan-500/50 transition-all resize-none shadow-inner custom-scrollbar placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* File Upload Zone */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 px-1">Upload Document (Optional)</label>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsHoveringDrop(true); }}
              onDragLeave={() => setIsHoveringDrop(false)}
              onDrop={(e) => { e.preventDefault(); setIsHoveringDrop(false); }}
              className={`w-full border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isHoveringDrop 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-white/10 bg-zinc-950/50 hover:bg-zinc-900 hover:border-white/20'
              }`}
            >
              <div className={`p-3 rounded-full mb-3 transition-colors ${isHoveringDrop ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-900 text-zinc-500'}`}>
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-zinc-300">Drop supporting docs here</p>
              <p className="text-[10px] text-zinc-600 uppercase mt-1">PDF, TXT, MD up to 10MB</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button 
              type="submit"
              disabled={!formData.name.trim()}
              className="w-full relative overflow-hidden group primary-btn bg-zinc-100 text-black hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500 py-4 font-bold flex items-center justify-center gap-2"
            >
              {/* Pulse Animation Base */}
              <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                Generate Project
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProjectForm;
