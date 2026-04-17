import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle2, Clock, ChevronRight, Layout, 
  AlertCircle, Terminal, ChevronDown, Check, Sparkles, Loader2, Search, Beaker 
} from 'lucide-react';
import FeatureSection from './FeatureSection';
import { generateSummary, searchProjectChanges } from '../../apis/project';

const InfoGathering = ({ project }) => {
  const [summary, setSummary] = useState(project?.summary || '');
  const [loading, setLoading] = useState(false);

  // Auto-fetch summary if missing
  useEffect(() => {
    if (!summary && project?.id) {
      handleGenerateSummary();
    }
  }, [project?.id]);

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

const TestingPhase = ({ project }) => {
  const [testModules, setTestModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestCases = async () => {
    if (!project?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/api/summary/testcases/${project.id}`);
      const data = await response.json();

      if (data.status === 'success') {
        setTestModules(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.message || 'Failed to fetch test cases');
      }
    } catch (err) {
      console.error('Error fetching test cases:', err);
      setError('Network error or AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, [project?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Generating Test_Suites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 glass-card bg-red-500/5 border-red-500/10">
        <Sparkles className="text-red-500 mb-4" size={32} />
        <p className="text-red-400 font-bold mb-4">{error}</p>
        <button 
          onClick={fetchTestCases}
          className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs"
        >
          Retry Search
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {testModules.length === 0 ? (
        <div className="glass-card p-12 text-center border-white/5 bg-zinc-900/20">
          <p className="text-zinc-500 italic">No test cases generated for this project yet.</p>
          <button 
            onClick={fetchTestCases}
            className="mt-6 px-6 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
          >
            Trigger AI Testing Scan
          </button>
        </div>
      ) : (
        testModules.map((module, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Beaker className="text-cyan-500" size={16} />
              </div>
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{module.title}</h3>
            </div>
            <div className="space-y-3">
              {module.testCases.map((test) => (
                <AccordionItem 
                  key={test.id} 
                  test={{
                    ...test,
                    name: test.title, // Map API 'title' to component 'name'
                    status: test.status.charAt(0).toUpperCase() + test.status.slice(1).toLowerCase() // Normalize status
                  }} 
                />
              ))}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

const FindChangesPhase = ({ project }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if(!searchQuery || !project?.id) return;
    setIsSearching(true);
    setResult(null);

    try {
      const response = await searchProjectChanges(project.id, searchQuery);
      if (response.status === 'success') {
        setResult({ type: 'success', text: response.data || response.message });
      } else {
        setResult({ type: 'error', text: response.message || "Failed to search document." });
      }
    } catch (error) {
      setResult({ type: 'error', text: error?.response?.data?.message || "An unexpected error occurred during search." });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="glass-card p-6 border-white/5 bg-zinc-900/40 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Search className="text-cyan-500" size={20} />
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-cyan-500">AI Analyzer</h3>
            <h2 className="text-lg font-bold text-zinc-100">Find Changes in User Story</h2>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask the AI about specific features or changes..."
              className="w-full bg-zinc-950/80 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:hover:bg-cyan-500/10 disabled:hover:border-cyan-500/30 min-w-[160px] shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isSearching ? 'Analyzing...' : 'Search AI'}
          </button>
        </div>

        {/* Results Area */}
        <div className="mt-6">
          <div className="p-6 rounded-xl bg-zinc-950/50 border border-white/5 font-mono text-sm leading-relaxed text-zinc-300 shadow-inner min-h-[140px] transition-all duration-500 relative overflow-hidden">
            {isSearching && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-pulse" />
            )}
            
            {isSearching ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-cyan-500/70 mb-4">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest">Scanning Document Content</span>
                </div>
                <div className="h-4 bg-white/5 rounded-md w-3/4 animate-pulse relative overflow-hidden" />
                <div className="h-4 bg-white/5 rounded-md w-full animate-pulse flex-1" />
                <div className="h-4 bg-white/5 rounded-md w-5/6 animate-pulse" />
              </div>
            ) : result ? (
              <div className={`flex items-start gap-4 p-4 rounded-lg border ${result.type === 'success' ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className={`p-1.5 rounded shrink-0 ${result.type === 'success' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-500'}`}>
                  {result.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                </div>
                <div>
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${result.type === 'success' ? 'text-cyan-500' : 'text-red-500'}`}>
                    {result.type === 'success' ? 'Matches Found' : 'Not Found'}
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed">{result.text}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic space-y-3 py-6">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-2">
                  <Terminal size={20} className="text-zinc-700" />
                </div>
                <p className="text-center text-xs">Awaiting query input.<br/>Ask me to find specific modules or verify functionality.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PhaseContent = ({ activeTab, project }) => {
  return (
    <div className="min-h-[400px] pb-12">
      <AnimatePresence mode="wait">
        <div key={activeTab}>
          {activeTab === 'info' && <InfoGathering project={project} />}
          {activeTab === 'coding' && <CodingPhase project={project} />}
          {activeTab === 'testing' && <TestingPhase project={project} />}
          {activeTab === 'history' && <FindChangesPhase project={project} />}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default PhaseContent;
