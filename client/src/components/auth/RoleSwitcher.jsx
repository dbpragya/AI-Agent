import React from 'react';
import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';

const RoleSwitcher = ({ selectedRole, onRoleChange }) => {
  const roles = [
    {
      id: 'user',
      title: 'Member',
      description: 'Individual Node',
      icon: User,
    },
    {
      id: 'admin',
      title: 'Team',
      description: 'Matrix Control',
      icon: Users,
    },
  ];

  return (
    <div className="flex gap-4 mb-6">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = selectedRole === role.id;
        
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleChange(role.id)}
            className="relative flex-1 group"
          >
            <div className={`
              h-full flex flex-col items-center p-4 rounded-xl border transition-all duration-300
              ${isActive 
                ? 'bg-primary-cyan/10 border-primary-cyan shadow-[0_0_15px_rgba(0,245,255,0.1)]' 
                : 'bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-900/80'}
            `}>
              <div className={`
                p-2 rounded-lg mb-2 transition-colors duration-300
                ${isActive ? 'bg-primary-cyan text-black' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'}
              `}>
                <Icon size={20} />
              </div>
              <span className={`text-sm font-semibold mb-1 transition-colors ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                {role.title}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                {role.description}
              </span>
            </div>
            
            {isActive && (
              <motion.div
                layoutId="role-glow"
                className="absolute inset-0 rounded-xl border border-primary-cyan/30 pointer-events-none z-[-1]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default RoleSwitcher;
