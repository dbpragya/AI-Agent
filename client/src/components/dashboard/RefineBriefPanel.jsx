import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, MessageSquare, Zap } from 'lucide-react';

const RefineBriefPanel = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-surface border-l border-white/10 z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Command size={18} className="text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">Refine_Brief</h2>
                  <p className="text-xs text-zinc-500">Update project requirements and mission parameters</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Active Context */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 block px-1">Active_Context</label>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 font-mono text-xs leading-relaxed text-zinc-400">
                  Current project focus is on high-fidelity authentication flows with specific attention to dark mode aesthetics and glassmorphic surfaces...
                </div>
              </div>

              {/* Requirement Input */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 block px-1 italic">Input_Requirements_</label>
                <div className="relative group">
                  <textarea 
                    placeholder="Enter new instructions or refine existing parameters..."
                    className="w-full min-h-[200px] bg-zinc-950 border border-white/10 rounded-2xl p-4 font-mono text-sm text-zinc-200 outline-none focus:border-cyan-500/50 transition-all resize-none shadow-inner custom-scrollbar"
                  />
                  <div className="absolute bottom-4 right-4 text-cyan-500/40 animate-pulse">
                    <Zap size={16} fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Enhance animations',
                  'Optimize performance',
                  'Add 3D elements',
                  'Restructure API'
                ].map((suggestion, i) => (
                  <button 
                    key={i}
                    className="p-3 rounded-xl border border-white/5 bg-zinc-900/30 hover:bg-zinc-900 hover:border-cyan-500/30 text-xs text-left text-zinc-500 hover:text-zinc-300 transition-all font-mono"
                  >
                    {'>'} {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-zinc-900/20">
              <button className="w-full primary-btn primary-btn-cyan flex items-center justify-center gap-2 group py-4">
                <MessageSquare size={18} />
                Commence_Protocol
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RefineBriefPanel;
