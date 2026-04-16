import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, id, icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative mb-6 group">
      {Icon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-primary-cyan' : 'text-zinc-500'}`}>
          <Icon size={20} />
        </div>
      )}
      
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3.5 pt-6 text-zinc-100 outline-none transition-all duration-300
          ${Icon ? 'pl-12' : 'pl-4'}
          ${isFocused 
            ? 'border-primary-cyan shadow-[0_0_15px_rgba(0,245,255,0.15)] ring-1 ring-primary-cyan/20' 
            : 'border-white/5 hover:border-white/10'}`}
        placeholder=" "
        required={required}
      />

      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-300 pointer-events-none
          ${Icon ? 'ml-12' : 'ml-4'}
          ${(isFocused || value) 
            ? 'top-2 text-[10px] uppercase tracking-wider font-bold text-primary-cyan' 
            : 'top-1/2 -translate-y-1/2 text-zinc-500'}`}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {/* Focus Glow Effect */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute -inset-[1px] rounded-xl border border-primary-cyan/30 pointer-events-none z-[-1]"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputField;
