import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { pageVariants, containerVariants, itemVariants } from '../motion/variants';

const MCQHome = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Simplified: extracting unique topics from all MCQs, or fetching aggregated
        const res = await api.get('/api/mcq');
        const uniqueTopics = [...new Set(res.data.map(q => q.topic))];
        setTopics(uniqueTopics);
      } catch (error) {
        console.error('Failed to fetch topics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="mcq-home-container" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '2rem' }}>MCQ Practice</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>Test your knowledge across various CS fundamentals and language-specific topics.</p>
      
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="skeleton" style={{ height: '140px' }} />
          <div className="skeleton" style={{ height: '140px' }} />
          <div className="skeleton" style={{ height: '140px' }} />
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="topic-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {topics.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No topics available yet.</p>
          ) : (
            topics.map(topic => (
              <motion.div variants={itemVariants} whileHover={{ y: -6 }} key={topic}>
                <Link to={`/mcq/quiz/${encodeURIComponent(topic)}`} style={{ textDecoration: 'none' }}>
                  <div className="topic-card" style={{ 
                    padding: '24px', 
                    borderRadius: 'var(--radius-lg)', 
                    backgroundColor: 'var(--bg-card)', 
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    transition: 'border-color var(--duration-fast)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <h3 style={{ textTransform: 'capitalize', fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>{topic}</h3>
                    <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       style={{ padding: '8px 24px', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary-text)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}>
                      Start Quiz
                    </motion.button>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MCQHome;
