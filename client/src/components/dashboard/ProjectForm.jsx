import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Zap, ArrowRight, ArrowLeft, FileText, X, RefreshCw, AlertCircle } from 'lucide-react';
import { uploadProject } from '../../apis/project';
import CustomLoader from '../common/CustomLoader';

const ProjectForm = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    story: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHoveringDrop(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/xml' || file.name.endsWith('.xml'))) {
      setSelectedFile(file);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await uploadProject({
        projectName: formData.name,
        description: formData.story,
        file: selectedFile
      });

      console.log('Project uploaded:', response);
      
      // Pass the new project data back to DashboardPage
      onSubmit({
        id: response.data._id || `proj_${Date.now()}`,
        name: response.data.projectName,
        story: response.data.description,
        fileName: selectedFile.name,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to initialize project. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.story.trim() && selectedFile;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="max-w-2xl mx-auto w-full relative"
    >
      <CustomLoader 
        isLoading={loading} 
        message="Initializing neural agent..." 
      />

      <button 
        onClick={onCancel}
        disabled={loading}
        className="mb-8 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors group px-2 py-1 rounded-md hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <div className="glass-card p-8 border-white/5 bg-zinc-900/60 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Zap size={16} className="text-cyan-500" />
            </div>
            Initialize New Project
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Provide core parameters for neural agent generation phase.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 px-1">Project Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter Project name"
              disabled={loading}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-zinc-100 outline-none focus:border-cyan-500/60 transition-all shadow-inner placeholder:text-zinc-700 disabled:opacity-50"
              required
            />
          </div>

          {/* Upload Document Section */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 px-1">Upload Document User Story</label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.xml"
              className="hidden"
              disabled={loading}
            />
            
            <div 
              onDragOver={(e) => { e.preventDefault(); !loading && setIsHoveringDrop(true); }}
              onDragLeave={() => setIsHoveringDrop(false)}
              onDrop={(e) => !loading && handleDrop(e)}
              onClick={() => !loading && !selectedFile && fileInputRef.current?.click()}
              className={`w-full border border-dashed rounded-xl transition-all overflow-hidden ${
                selectedFile 
                  ? 'border-cyan-500/50 bg-cyan-500/5 cursor-default'
                  : isHoveringDrop 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-white/10 bg-zinc-950/50 hover:bg-zinc-900 hover:border-white/20'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <AnimatePresence mode="wait">
                {!selectedFile ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 flex flex-col items-center justify-center text-center"
                  >
                    <div className={`p-3 rounded-full mb-3 transition-colors ${isHoveringDrop ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-900 text-zinc-500'}`}>
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-zinc-300">Drop user story here or click to browse</p>
                    <p className="text-[10px] text-zinc-600 uppercase mt-1 text-center">XML, PDF SUPPORTED</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="shrink-0 p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for processing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        type="button"
                        onClick={() => !loading && fileInputRef.current?.click()}
                        disabled={loading}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
                        title="Re-upload"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => !loading && removeFile(e)}
                        disabled={loading}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Story Textfield */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">User Story Textfield</label>
            </div>
            <textarea 
              value={formData.story}
              onChange={(e) => setFormData({...formData, story: e.target.value})}
              placeholder="Enter user story description here..."
              disabled={loading}
              className="w-full min-h-[100px] bg-zinc-950 border border-white/10 rounded-xl p-4 font-mono text-sm text-zinc-200 outline-none focus:border-cyan-500/50 transition-all resize-none shadow-inner custom-scrollbar placeholder:text-zinc-700 disabled:opacity-50"
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <div className="pt-6 border-t border-white/5">
            <button 
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full relative overflow-hidden group primary-btn bg-zinc-100 text-black hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500 py-4 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <AnimatePresence>
                {isFormValid && !loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-cyan-500/20 group-hover:animate-pulse transition-opacity" 
                  />
                )}
              </AnimatePresence>
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                Generate Project
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProjectForm;
