import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { pageVariants } from '../motion/variants';
import LimitGate from '../components/LimitGate';

const InterviewSetup = () => {
  const [role, setRole] = useState('Frontend Developer');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/interview/start', { role, difficulty });
      navigate(`/interview/session/${res.data.sessionId}`, {
        state: { initialMessage: res.data.message }
      });
    } catch (error) {
      toast.error('Failed to start interview.');
      console.error('Failed to start interview:', error);
      setLoading(false);
    }
  };

  return (
    <LimitGate type="interview">
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="interview-setup-container" style={{ padding: '24px', maxWidth: '600px', margin: '40px auto' }}>
        <div className="setup-card" style={{ padding: '40px 32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '12px', marginTop: 0 }}>Mock Interview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>Configure your AI-powered behavioral and technical interview.</p>
        </div>

        <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Target Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', transition: 'border-color var(--duration-fast)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Difficulty Level</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', transition: 'border-color var(--duration-fast)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="easy">Easy (Junior / Entry-level)</option>
              <option value="medium">Medium (Mid-level)</option>
              <option value="hard">Hard (Senior / Staff)</option>
            </select>
          </div>

          <motion.button 
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '16px', 
              padding: '14px 24px', 
              backgroundColor: 'var(--color-primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px color-mix(in srgb, var(--color-primary) 40%, transparent)'
            }}
          >
            {loading ? 'Starting Environment...' : 'Start Interview'}
          </motion.button>
        </form>
      </div>
      </motion.div>
    </LimitGate>
  );
};

export default InterviewSetup;
