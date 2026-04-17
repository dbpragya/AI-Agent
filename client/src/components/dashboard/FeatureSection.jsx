import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Sparkles, Loader2, ListFilter } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeatureSection = ({ projectId }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  // Helper to parse features string into structured JSON objects (client-side)
  const parseFeatures = (featuresString) => {
    if (!featuresString) return [];
    
    return featuresString
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map((line, index) => {
        const name = line.replace(/^[-*]\s+/, '').trim();
        const id = name.toLowerCase().replace(/\s+/g, '_');
        return {
          id,
          name,
          json: {
            module: name,
            status: "active",
            dependencies: ["framework_core"],
            version: "1.0.0",
            last_updated: new Date().toISOString().split('T')[0],
            config: {
              debug: false,
              max_instances: 5,
              retry_policy: "linear"
            }
          }
        };
      });
  };

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // We use the base summary endpoint which returns all projects
        // because we are avoiding server-side code changes as requested.
        const response = await axios.get(`http://localhost:5000/api/summary`);
        if (response.data.status === 'success') {
          const allProjects = response.data.data || [];
          const currentProject = allProjects.find(p => p._id === projectId);
          
          if (currentProject) {
            const structured = parseFeatures(currentProject.features);
            setFeatures(structured);
          } else {
            setFeatures([]);
          }
        } else {
          setError('Failed to fetch project features');
        }
      } catch (err) {
        console.error('Error fetching features:', err);
        setError('Network error while loading features');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, [projectId]);

  const toggleFeature = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Compiling Feature_Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 glass-card bg-red-500/5 border-red-500/10">
        <Sparkles className="text-red-500 mb-4" size={32} />
        <p className="text-red-400 font-bold">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs"
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <ListFilter className="text-cyan-500" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Project_Features</h2>
            <p className="text-[10px] uppercase text-zinc-500 font-mono tracking-widest">Found {features.length} technical modules</p>
          </div>
        </div>
      </div>

      {features.length === 0 ? (
        <div className="glass-card p-12 text-center border-white/5 bg-zinc-900/20">
          <p className="text-zinc-500 italic">No features detected in this project architecture yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <FeatureCard 
                  feature={feature}
                  isExpanded={expandedId === feature.id}
                  onToggle={() => toggleFeature(feature.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FeatureSection;
