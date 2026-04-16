import React from 'react';
import { motion } from 'framer-motion';
import { Info, Layout, Code2, Beaker, History as HistoryIcon } from 'lucide-react';

const tabs = [
  { id: 'info', label: 'Info Gathering', icon: Info },
  { id: 'design', label: 'Design Phase', icon: Layout },
  { id: 'coding', label: 'Coding Phase', icon: Code2 },
  { id: 'testing', label: 'Testing Phase', icon: Beaker },
  { id: 'history', label: 'History', icon: HistoryIcon },
];

const PhaseTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="relative mb-8 border-b border-white/5">
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative py-4 flex items-center gap-2 group transition-colors ${
                isActive ? 'text-cyan-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-cyan-500' : 'text-zinc-500 group-hover:text-zinc-400'} />
              <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseTabs;
