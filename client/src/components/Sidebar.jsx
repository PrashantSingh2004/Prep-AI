import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Code2, CheckSquare, MessageSquare, User, LogOut, Star, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/questions', label: 'Coding Questions', icon: Code2 },
  { path: '/mcq', label: 'MCQ Practice', icon: CheckSquare },
  { path: '/interview/setup', label: 'Mock Interview', icon: MessageSquare },
];

export const Sidebar = () => {
  const { user, logout, setIsProfileOpen } = useAuth();

  return (
    <>
      <style>
        {`
          .sidebar-container {
            width: 220px;
            background-color: var(--bg-surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100vh;
            position: sticky;
            top: 0;
            z-index: 50;
          }
          
          .sidebar-logo {
            padding: 24px;
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--color-primary);
            letter-spacing: -0.5px;
          }

          .nav-links {
            flex: 1;
            padding: 0 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .nav-item {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: color var(--duration-fast);
          }

          .nav-item.active {
            color: var(--color-primary-text);
          }

          .active-bg {
            position: absolute;
            inset: 0;
            background-color: var(--color-primary-bg);
            border-radius: var(--radius-md);
            border-left: 3px solid var(--color-primary);
            z-index: -1;
          }

          .sidebar-footer {
            padding: 20px 16px;
            border-top: 1px solid var(--border);
          }

          .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            cursor: pointer;
            padding: 8px;
            border-radius: var(--radius-md);
            transition: background var(--duration-fast);
          }
          .user-profile:hover {
            background-color: var(--bg-card-alt);
          }

          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--color-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }

          .logout-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            background: none;
            border: none;
            color: var(--color-danger);
            font-weight: 500;
            padding: 10px;
            cursor: pointer;
            border-radius: var(--radius-sm);
            transition: background var(--duration-fast);
          }
          .logout-btn:hover {
            background-color: var(--color-danger-bg);
          }

          /* Tablet & Bottom Nav mappings will go in index.css */
        `}
      </style>

      <nav className="sidebar-container hidden md:flex">
        <div>
          <div className="sidebar-logo">
            PrepAI.
          </div>
          
          <div className="nav-links">
            <AnimatePresence>
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.path === '/dashboard'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                  {({ isActive }) => (
                    <motion.div whileHover={{ x: 4 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                      <item.icon size={20} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="active-bg"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </AnimatePresence>

            {user?.subscription?.plan !== 'pro' && (
              <div style={{ marginTop: 'auto', background: 'var(--color-primary-bg)', borderRadius: 'var(--radius-lg)', padding: '16px', border: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-text)', fontWeight: 600, marginBottom: '4px' }}>
                  <Zap size={16} fill="var(--color-primary-text)" /> Go Pro
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Unlock unlimited access to everything.
                </div>
                <Link to="/payment?billing=monthly" style={{ display: 'block', width: '100%', textAlign: 'center', background: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: 'var(--radius-sm)', padding: '8px', fontSize: '13px', fontWeight: 600 }}>
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile" onClick={() => setIsProfileOpen(true)}>
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '14px' }}>{user?.name}</div>
              {user?.subscription?.plan === 'pro' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                  <Star size={10} fill="white" /> Pro
                </div>
              ) : (
                <div style={{ display: 'inline-block', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-accent)', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                  Free
                </div>
              )}
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout} 
            className="logout-btn"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Visible only on strict mobile via CSS) */}
      <nav className="mobile-bottom-nav flex md:hidden">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `bottom-icon ${isActive ? 'active' : ''}`}>
            {({ isActive }) => (
              <>
                <item.icon size={24} />
                {isActive && (
                  <motion.div
                    layoutId="activeBottomNav"
                    className="active-bottom-indicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
