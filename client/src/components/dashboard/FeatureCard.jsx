import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Code2 } from 'lucide-react';
import JsonViewer from './JsonViewer';

const FeatureCard = ({ feature, isExpanded, onToggle }) => {
  return (
    <div className={`glass-card border-white/5 bg-zinc-900/40 overflow-hidden transition-all duration-300 ${isExpanded ? 'border-cyan-500/30 ring-1 ring-cyan-500/10' : 'hover:border-white/10'}`}>
      <div 
        onClick={onToggle}
        className="p-5 cursor-pointer group flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl bg-zinc-950/50 border border-white/5 text-cyan-500 transition-transform duration-300 ${isExpanded ? 'scale-110 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'group-hover:scale-110'}`}>
            <Code2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">{feature.name}</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Configuration Module</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/50 border border-white/5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all">
          <span>{isExpanded ? 'Collapse' : 'Tap to View JSON'}</span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-0 border-t border-white/5 bg-zinc-950/20">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-4"
              >
                <JsonViewer data={feature.json} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureCard;
