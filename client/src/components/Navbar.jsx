import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, User as UserIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setIsProfileOpen } = useAuth();
  const location = useLocation();

  // Basic breadcrumb generation
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/questions')) return 'Coding Challenges';
    if (path.includes('/mcq/quiz')) return 'Quiz Active';
    if (path.includes('/mcq/results')) return 'Quiz Results';
    if (path.includes('/mcq')) return 'MCQ Practice';
    if (path.includes('/interview/session')) return 'Interview Session';
    if (path.includes('/interview/setup')) return 'Mock Interview Setup';
    return 'PrepAI Platform';
  };

  return (
    <>
      <style>
        {`
          .top-navbar {
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            background-color: var(--bg-surface);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 40;
          }

          .nav-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
          }

          .theme-toggle-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background var(--duration-fast);
            position: relative;
          }

          .theme-toggle-btn:hover {
            background-color: var(--bg-card-alt);
            color: var(--text-primary);
          }

          .navbar-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--color-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            cursor: pointer;
            transition: transform var(--duration-fast);
            user-select: none;
          }
          .navbar-avatar:hover {
            transform: scale(1.05);
          }
        `}
      </style>
      <header className="top-navbar">
        <h2 className="nav-title">{getPageTitle()}</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <motion.button 
             onClick={toggleTheme}
             className="theme-toggle-btn"
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
          >
             <AnimatePresence mode="wait">
               {theme === 'dark' ? (
                 <motion.div
                   key="sun"
                   initial={{ rotate: -90, opacity: 0 }}
                   animate={{ rotate: 0, opacity: 1 }}
                   exit={{ rotate: 90, opacity: 0 }}
                   transition={{ duration: 0.2 }}
                   style={{ position: 'absolute' }}
                 >
                   <Sun size={22} />
                 </motion.div>
               ) : (
                 <motion.div
                   key="moon"
                   initial={{ rotate: -90, opacity: 0 }}
                   animate={{ rotate: 0, opacity: 1 }}
                   exit={{ rotate: 90, opacity: 0 }}
                   transition={{ duration: 0.2 }}
                   style={{ position: 'absolute' }}
                 >
                   <Moon size={22} />
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.button>
            <div 
              className="navbar-avatar" 
              onClick={() => setIsProfileOpen(true)}
              title="Open Profile"
            >
              {user?.name?.charAt(0).toUpperCase() || <UserIcon size={18} />}
            </div>
          </div>
        </header>
    </>
  );
};
