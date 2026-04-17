import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CustomLoader - A premium "Neural Core" themed loader.
 * Designed to be smooth, non-intrusive, and highly aesthetic.
 */
const CustomLoader = ({ isLoading, message = "Processing..." }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-white/5"
        >
          {/* Neural Pulse Core */}
          <div className="relative w-24 h-24 mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                borderWidth: ["1px", "2px", "1px"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-3 rounded-full border-t border-r border-transparent border-t-cyan-400 border-r-cyan-400/30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [0.8, 1, 0.8],
                  backgroundColor: ["rgba(6,182,212,0.2)", "rgba(6,182,212,0.4)", "rgba(6,182,212,0.2)"]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl border border-cyan-500/40 flex items-center justify-center backdrop-blur-sm"
              >
                <div className="w-3 h-3 bg-cyan-500 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              </motion.div>
            </div>
          </div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 text-center"
          >
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">
              {message}
            </h2>
            <div className="flex items-center justify-center gap-1">
              <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" />
            </div>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mt-2">
              Neural_Engine_Active
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomLoader;
