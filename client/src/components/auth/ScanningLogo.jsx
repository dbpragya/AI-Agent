import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const ScanningLogo = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="relative">
        {/* Outer pulse */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-primary-cyan rounded-full blur-2xl"
        />
        
        {/* Core icon container */}
        <div className="relative bg-zinc-950 border border-white/10 p-5 rounded-2xl shadow-2xl overflow-hidden group">
          <Brain className="w-10 h-10 text-primary-cyan active:scale-95 transition-transform" />
          
          {/* Scanning line animation */}
          <motion.div
            animate={{
              top: ['-10%', '110%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-cyan to-transparent shadow-[0_0_10px_#00f5ff]"
          />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary-cyan animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">
          Neural Interface Active
        </span>
      </motion.div>
    </div>
  );
};

export default ScanningLogo;
