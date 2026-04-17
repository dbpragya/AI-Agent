import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children, sidebar, header }) => {
  return (
    <div className="min-h-screen bg-background text-zinc-400 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-background/60 to-background" />
      </div>

      <div className="flex flex-1 relative z-10 overflow-hidden">
        {/* Sidebar Space (Actual Sidebar is absolute or fixed for collapse logic) */}
        {sidebar}

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {header}

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
