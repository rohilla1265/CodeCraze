import React from 'react';
import { NavLink } from 'react-router';
import { Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user, isProfileOpen, setIsProfileOpen, dropdownRef, handleLogout }) {
  return (
    <nav className="border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <NavLink
            to="/"
            className="flex items-center gap-3 text-2xl font-extrabold text-white hover:opacity-90 transition-opacity no-underline group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all duration-300">
              <Code2 className="w-6 h-6 text-indigo-500 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="tracking-tight">
              Code<span className="text-indigo-500">Craze</span>
            </span>
          </NavLink>
          <div className="hidden md:flex gap-10 text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-500 items-center">
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? "text-indigo-400 pb-1.5 border-b-2 border-indigo-500" : "hover:text-slate-200 transition-colors pb-1.5"}
            >
              Problems
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="hover:text-white transition-all pb-1.5">Admin</NavLink>
            )}
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3.5 hover:bg-slate-800/50 p-1.5 pr-4 rounded-full transition-all border border-slate-800 hover:border-slate-700 active:scale-95 shadow-inner"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500/40 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.firstname?.charAt(0) || 'G'}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user?.firstname || 'Guest'}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wider">{user?.role || 'Explorer'}</p>
            </div>
            <span className={`text-slate-600 text-xs transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3.5 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-black/30 py-3 z-[60] overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-slate-800 mb-1.5 bg-slate-950/40">
                  <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-1">Account</p>
                  <p className="text-sm font-medium text-slate-100 truncate">{user?.email || 'Guest User'}</p>
                </div>
                <NavLink to="/profile" className="flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors">
                  <span className="text-lg opacity-80">👤</span> My Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <span className="text-lg opacity-80">➔</span> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}