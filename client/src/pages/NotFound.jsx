import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants } from '../motion/variants';

const NotFound = () => {
  return (
    <motion.div 
      variants={pageVariants} 
      initial="initial" 
      animate="animate" 
      exit="exit"
      style={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        style={{ fontSize: '8rem', fontWeight: '900', color: 'var(--color-primary)', lineHeight: 1, marginBottom: '20px' }}
      >
        404
      </motion.div>
      <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/dashboard" 
        style={{ 
          padding: '12px 24px', 
          backgroundColor: 'var(--color-primary)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: 'var(--radius-md)', 
          fontWeight: '600',
          transition: 'transform var(--duration-fast)',
          display: 'inline-block'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Return to Dashboard
      </Link>
    </motion.div>
  );
};

export default NotFound;
