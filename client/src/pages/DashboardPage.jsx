import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import Sidebar from '../components/dashboard/Sidebar';
import ProjectHeader from '../components/dashboard/ProjectHeader';
import RefineBriefPanel from '../components/dashboard/RefineBriefPanel';
import PhaseTabs from '../components/dashboard/PhaseTabs';
import PhaseContent from '../components/dashboard/PhaseContent';
import ProjectList from '../components/dashboard/ProjectList';
import ProjectForm from '../components/dashboard/ProjectForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const DashboardPage = () => {
  const [view, setView] = useState('list'); // 'list', 'create', 'detail'
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [activeTab, setActiveTab] = useState('info');
  const [isRefineOpen, setIsRefineOpen] = useState(false);

  const handleCreateProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
    setView('detail');
    setActiveTab('info');
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setView('detail');
    setActiveTab('info');
  };

  const renderHeader = () => {
    if (view === 'detail') {
      return (
        <ProjectHeader 
          project={selectedProject}
          onRefineClick={() => setIsRefineOpen(true)} 
          onBack={() => setView('list')}
        />
      );
    }
    
    // For 'list' or 'create'
    return (
      <header className="h-16 shrink-0 border-b border-white/5 bg-surface/50 backdrop-blur-md px-6 md:px-8 flex items-center justify-between z-10 w-full text-zinc-100">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-tight text-lg">Comrade Ai</span>
        </div>
        
        {view === 'list' && (
          <button 
            onClick={() => setView('create')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-zinc-200 transition-all text-sm font-medium hover:text-cyan-400 group"
          >
            <Plus size={16} className="text-zinc-500 group-hover:text-cyan-500 transition-colors" />
            New Project
          </button>
        )}
      </header>
    );
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      header={renderHeader()}
    >
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full"
          >
            <ProjectList 
              projects={projects} 
              onSelectProject={handleSelectProject}
              onCreateNew={() => setView('create')}
            />
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex items-center justify-center p-4"
          >
            <ProjectForm 
              onCancel={() => setView('list')} 
              onSubmit={handleCreateProject}
            />
          </motion.div>
        )}

        {view === 'detail' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="h-full flex flex-col"
          >
             {/* Small back affordance specifically requested for AddProject screen, mapped here conceptually if want back button on detail too but already added to project header */}
            <PhaseTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 overflow-y-auto">
              <PhaseContent activeTab={activeTab} project={selectedProject} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RefineBriefPanel 
        isOpen={isRefineOpen} 
        onClose={() => setIsRefineOpen(false)} 
        project={selectedProject}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
