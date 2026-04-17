import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Sparkles, Loader2, ListFilter, RefreshCw } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeatureSection = ({ projectId }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatures = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching structured features for project: ${projectId}`);
      
      const response = await axios.get(`http://localhost:5000/api/summary/features/${projectId}`);
      
      if (response.data.status === 'success') {
        const data = response.data.data;
        // The endpoint returns a structured JSON array
        setFeatures(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch project features');
      }
    } catch (err) {
      console.error('Error fetching features:', err);
      setError('Network error or AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Architecting Feature_Mesh...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 glass-card bg-red-500/5 border-red-500/10">
        <Sparkles className="text-red-500 mb-4" size={32} />
        <p className="text-red-400 font-bold mb-4">{error}</p>
        <button 
          onClick={fetchFeatures}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw size={14} />
          Retry AI Generation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <ListFilter className="text-cyan-500" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">AI Generated Features</h2>
            <p className="text-[10px] uppercase text-zinc-500 font-mono tracking-widest mt-0.5">
              Detected {features.length} core technical modules
            </p>
          </div>
        </div>

        <button 
          onClick={fetchFeatures}
          className="p-2 rounded-lg bg-zinc-900/50 border border-white/5 text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-lg"
          title="Regenerate Features"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {features.length === 0 ? (
        <div className="glass-card p-16 text-center border-white/5 bg-zinc-900/20">
          <p className="text-zinc-500 italic font-mono text-sm">No features detected in this project architecture yet.</p>
          <button 
            onClick={fetchFeatures}
            className="mt-6 px-6 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
          >
            Trigger AI Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {features.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <FeatureCard module={module} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FeatureSection;
