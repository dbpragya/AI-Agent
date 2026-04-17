import React from 'react';
import { motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="relative group">
        {/* outer glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-cyan/20 to-primary-violet/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative glass-card p-8 md:p-10">
          {title && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-zinc-500 text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthCard;
