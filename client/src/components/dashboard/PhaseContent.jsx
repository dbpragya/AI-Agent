import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle2, Clock, ChevronRight, Layout, 
  AlertCircle, Terminal, ChevronDown, Check, Sparkles, Loader2 
} from 'lucide-react';
import FeatureSection from './FeatureSection';
import { generateSummary } from '../../apis/project';const InfoGathering = ({ project }) => {
  const [summary, setSummary] = useState(project?.summary || '');
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (!project?.id || loading) return;
    
    setLoading(true);
    try {
      const response = await generateSummary(project.id);
      if (response.status === 'success') {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="glass-card p-8 border-white/5 bg-zinc-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <FileText size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <FileText className="text-cyan-500" size={20} />
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-cyan-500">Executive Summary</h3>
                <h2 className="text-xl font-bold text-zinc-100">{project?.name || 'Project Overview'}</h2>
              </div>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {summary ? 'Regenerate AI Summary' : 'Generate AI Summary'}
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-zinc-950/50 border border-white/5 font-mono text-sm leading-relaxed text-zinc-300 shadow-inner min-h-[120px] transition-all duration-500">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-5/6" />
                </div>
              ) : (
                summary || <span className="text-zinc-600 italic">No summary generated yet. Click the button above to analyze document.</span>
              )}
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3 block px-1">Source_Directive_Text</h4>
              <div className="p-4 rounded-lg bg-zinc-900/30 border border-white/5 text-xs text-zinc-500 italic max-h-[100px] overflow-y-auto custom-scrollbar">
                "{project?.story || 'No raw story text provided.'}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CodingPhase = ({ project }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <FeatureSection projectId={project?.id} />
  </motion.div>
);

const AccordionItem = ({ test }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-white/5 bg-zinc-900/20 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${
            test.status === 'Success' ? 'bg-green-500/10 text-green-500' : 
            test.status === 'In Progress' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-zinc-800 text-zinc-600'
          }`}>
            {test.status === 'Success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{test.id}</span>
            <h4 className="text-sm font-medium text-zinc-200 group-hover:text-cyan-400 transition-colors">{test.name}</h4>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest whitespace-nowrap hidden sm:block ${
            test.status === 'Success' ? 'bg-green-500/20 text-green-400' : 
            test.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-500'
          }`}>
            {test.status}
          </span>
          <ChevronDown size={18} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-white/5 bg-zinc-950/30">
              <div className="mt-4 px-4 border-l-2 border-cyan-500/30 space-y-3">
                {test.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-zinc-400">
                    <span className="font-mono text-zinc-600 text-xs mt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TestingPhase = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-3"
  >
    {[
      { 
        id: 'AUTH_001', name: 'Test Login Flow', status: 'Success', 
        steps: ['Render login form', 'Input valid credentials', 'Assert API request payload', 'Verify token in localStorage', 'Confirm redirect to Dashboard'] 
      },
      { 
        id: 'CONN_042', name: 'Neural_Bridge_Handshake', status: 'Pending Scan', 
        steps: ['Initiate WebSocket connection', 'Send HELO payload', 'Await ACK response', 'Measure latency (<50ms)'] 
      },
      { 
        id: 'SEC_009', name: 'Input Sanitization', status: 'In Progress', 
        steps: ['Inject XSS payloads into input fields', 'Verify escaping on render', 'Assert rejection on API level'] 
      }
    ].map((test) => (
      <AccordionItem key={test.id} test={test} />
    ))}
  </motion.div>
);

const HistoryPhase = () => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-900 ml-4 border-white/5"
  >
    {[
      { date: '12 OCT', title: 'Neural Protocols Updated', tags: ['Security', 'V2.1'], changes: '4 detected' },
      { date: '10 OCT', title: 'Design Aesthetic Realignment', tags: ['UI/UX'], changes: '12 detected' },
      { date: '08 OCT', title: 'Alpha Release: Module_v0.1', tags: ['Core'], changes: 'Initial setup' },
    ].map((item, i) => (
      <div key={i} className="relative group">
        <div className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-surface border-2 border-zinc-800 group-hover:border-cyan-500/50 transition-all z-10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-cyan-500 transition-colors" />
        </div>
        <div className="space-y-2 pb-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono text-cyan-500/70 tracking-tighter w-12">{item.date}</span>
            <h4 className="text-sm font-bold text-zinc-300 group-hover:text-zinc-100">{item.title}</h4>
            <div className="flex gap-2">
              {item.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-[9px] text-zinc-500 uppercase tracking-widest">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Clock size={12} />
            <span className="font-mono text-[10px] text-zinc-500">{item.changes}</span>
          </div>
        </div>
      </div>
    ))}
  </motion.div>
);

const PhaseContent = ({ activeTab, project }) => {
  return (
    <div className="min-h-[400px] pb-12">
      <AnimatePresence mode="wait">
        <div key={activeTab}>
          {activeTab === 'info' && <InfoGathering project={project} />}
          {activeTab === 'coding' && <CodingPhase project={project} />}
          {activeTab === 'testing' && <TestingPhase project={project} />}
          {activeTab === 'history' && <HistoryPhase project={project} />}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default PhaseContent;
