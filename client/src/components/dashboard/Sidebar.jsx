import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Terminal, History, Settings, LogOut, Box } from 'lucide-react';

const Sidebar = () => {
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

      {/* Main Content Area (Empty for future items) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
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
