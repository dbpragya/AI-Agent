import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Glow Spheres */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary-cyan/10 rounded-full blur-[120px]"
        />
        
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-violet/10 rounded-full blur-[120px]"
        />

        {/* Floating digital particles/bits */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%', 
              opacity: Math.random() * 0.5 
            }}
            animate={{
              y: [null, '-20%', '120%'],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-px h-12 bg-gradient-to-b from-transparent via-primary-cyan/40 to-transparent"
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 mt-8 flex items-center gap-1.5 opacity-40">
        <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-400">Secure Protocol v7.2</span>
        <div className="w-1 h-1 rounded-full bg-primary-cyan" />
        <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-400">Encrypted</span>
      </div>
    </div>
  );
};

export default AuthLayout;
