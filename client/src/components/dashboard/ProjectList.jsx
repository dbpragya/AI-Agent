import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Clock, PlusCircle } from 'lucide-react';

const ProjectList = ({ projects, onSelectProject, onCreateNew }) => {
  if (projects.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto text-center space-y-6"
      >
        <div className="w-24 h-24 rounded-[32px] bg-zinc-900/50 border border-white/5 flex items-center justify-center shadow-inner relative group cursor-pointer" onClick={onCreateNew}>
          <div className="absolute inset-0 bg-cyan-500/10 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <FolderGit2 className="text-zinc-600 group-hover:text-cyan-500 transition-colors duration-300" size={40} />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <PlusCircle size={16} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">No projects found</h2>
          <p className="text-zinc-500 text-sm">Initialize your first AI-driven project space to begin generation.</p>
        </div>

        <button 
          onClick={onCreateNew}
          className="mt-4 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-cyan-500/30 rounded-xl text-zinc-300 hover:text-cyan-400 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all duration-300 font-medium text-sm flex gap-2 items-center"
        >
          <PlusCircle size={18} /> Add Project
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2"
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          whileHover={{ y: -4 }}
          onClick={() => onSelectProject(project)}
          className="glass-card p-5 cursor-pointer border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <FolderGit2 size={40} strokeWidth={1} className="text-cyan-500" />
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center text-cyan-500 font-bold text-lg shadow-inner">
              {project.name.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <h3 className="font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors uppercase tracking-tight truncate">
                {project.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2 min-h-[32px]">
                {project.story || 'Generated neural space'}
              </p>
            </div>
          </div>
          
          <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center gap-1.5 font-mono">
              <Clock size={12} />
              <span>{project.updatedAt}</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-500/50 group-hover:text-cyan-500 transition-colors">
              Enter_Node
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectList;
