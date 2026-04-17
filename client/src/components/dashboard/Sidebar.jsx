import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Terminal, History, Settings, LogOut, Box } from 'lucide-react';

const RoboticAnimation = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full w-full opacity-60 mt-16"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex items-center justify-center w-32 h-32"
      >
        {/* Outer glowing ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-t border-cyan-400/50"
        />
        
        {/* Core head */}
        <div className="relative w-16 h-16 bg-zinc-900 border border-zinc-700 shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-2xl flex items-center justify-center overflow-hidden">
          {/* Eyes container */}
          <div className="flex gap-2 relative z-10 w-full justify-center px-2">
            <motion.div 
              animate={{ 
                height: [4, 12, 12, 4, 12], 
                scaleY: [1, 0.1, 1, 1] 
              }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.5, 0.9, 1] }}
              className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            />
            <motion.div 
              animate={{ height: [4, 12, 12, 4, 12], scaleY: [1, 0.1, 1, 1] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.1, 0.5, 0.9, 1], delay: 0.1 }}
              className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            />
          </div>
          
          {/* Scanning line */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.5)] z-20"
          />
        </div>
      </motion.div>
      <div className="mt-8 space-y-2 text-center relative z-20">
        <motion.div 
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold"
        >
          System Idle
        </motion.div>
        <div className="text-xs text-zinc-500 font-mono">Awaiting Directive</div>
      </div>
    </motion.div>
  );
};

const Sidebar = ({ view }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);



  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="relative flex flex-col bg-surface border-r border-white/5 z-20 h-screen transition-all duration-300"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 w-6 h-6 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-cyan-500 transition-colors z-30"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
          <Box className="text-cyan-500" size={18} />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-zinc-100 tracking-tight uppercase"
          >
            Comrade Ai
          </motion.span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden px-4 py-6 scrollbar-hide relative">
        <AnimatePresence>
          {view === 'list' && !isCollapsed && <RoboticAnimation key="robot-anim" />}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300 transition-all">
          <Settings size={18} />
          {!isCollapsed && <span className="text-xs font-medium">Configurations</span>}
        </button>
        <button className="w-full flex items-center gap-3 p-2 rounded-lg text-zinc-500 hover:bg-white/[0.02] hover:text-red-500 transition-all">
          <LogOut size={18} />
          {!isCollapsed && <span className="text-xs font-medium">Decommission</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
