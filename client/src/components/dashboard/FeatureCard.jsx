import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Code2, Layout, Zap } from 'lucide-react';
import JsonViewer from './JsonViewer';

const FeatureCard = ({ module }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const generateSubFeatureJson = (featureName) => {
    // Generate a contextual dummy JSON for the sub-feature
    const id = featureName.toLowerCase().replace(/\s+/g, '_');
    return {
      module_id: id,
      name: featureName,
      architecture: "neural_grid_v4",
      properties: {
        access_level: "encrypted",
        priority: "p1_critical",
        latency_requirement: "<20ms",
        data_model: "schema_agnostic"
      },
      endpoints: [
        { path: `/api/v1/${id}/initiate`, method: "POST" },
        { path: `/api/v1/${id}/status`, method: "GET" }
      ],
      deployment: {
        env: "edge_node",
        scaling: "auto_managed"
      }
    };
  };

  const toggleSubFeature = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="glass-card flex flex-col border-white/5 bg-zinc-900/40 overflow-hidden hover:border-cyan-500/20 transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            <Layout size={18} />
          </div>
          <h3 className="font-bold text-zinc-100 text-base tracking-tight">{module.title}</h3>
        </div>
        <div className="px-2 py-0.5 rounded-md bg-zinc-950/50 border border-white/5 text-[9px] text-zinc-500 uppercase font-mono tracking-widest group-hover:text-cyan-400 transition-colors">
          {module.screensCount} SC_REENS
        </div>
      </div>

      {/* Feature List */}
      <div className="p-5 flex-1 space-y-2">
        {module.features.map((feature, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-cyan-500 transition-colors" />
                <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{feature}</span>
              </div>
              
              <button 
                onClick={() => toggleSubFeature(i)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                  expandedIndex === i 
                    ? 'bg-cyan-500 text-zinc-950' 
                    : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {expandedIndex === i ? (
                  <>
                    <Zap size={10} />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <Code2 size={10} />
                    <span>Convert to JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* In-place JSON Viewer */}
            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-3 pt-1">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                    >
                      <JsonViewer data={generateSubFeatureJson(feature)} />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-zinc-950/30 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
          <Zap size={10} className="text-cyan-500/50" />
          <span>MODULE_INTEGRITY: 98.4%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-cyan-500 transition-colors cursor-pointer group">
          <span>Documentation</span>
          <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
