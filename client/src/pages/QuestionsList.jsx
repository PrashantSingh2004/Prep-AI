import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import api from '../services/api';
import { pageVariants, containerVariants, itemVariants } from '../motion/variants';

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        let url = '/api/questions';
        const params = new URLSearchParams();
        if (filterDifficulty) params.append('difficulty', filterDifficulty);
        if (search) params.append('search', search);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const res = await api.get(url);
        // Accommodate new pagination response format
        setQuestions(res.data.data || res.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filterDifficulty, search]);

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'easy': return 'var(--color-success)';
      case 'medium': return 'var(--color-accent)';
      case 'hard': return 'var(--color-danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="questions-container" style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>Coding Challenges</h1>
        
        <div className="filters" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          />
          <select 
            value={filterDifficulty} 
            onChange={(e) => setFilterDifficulty(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div className="skeleton" style={{ height: '70px', width: '100%' }} />
           <div className="skeleton" style={{ height: '70px', width: '100%' }} />
           <div className="skeleton" style={{ height: '70px', width: '100%' }} />
           <div className="skeleton" style={{ height: '70px', width: '100%' }} />
        </div>
      ) : (
        <motion.ul variants={containerVariants} initial="hidden" animate="show" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
          {questions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No questions found matching your criteria.
            </div>
          ) : (
            questions.map(q => (
              <motion.li 
                key={q._id} 
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <Link to={`/questions/${q._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    padding: '20px 24px', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-card)',
                    transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {q.status === 'solved' ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12, stiffness: 200 }}>
                          <CheckCircle2 color="var(--color-success)" size={24} />
                        </motion.div>
                      ) : (
                        <Circle color="var(--border-strong)" size={24} />
                      )}
                      <div>
                        <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{q.title}</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            color: getDifficultyColor(q.difficulty),
                            backgroundColor: `color-mix(in srgb, ${getDifficultyColor(q.difficulty)} 10%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${getDifficultyColor(q.difficulty)} 20%, transparent)`,
                            textTransform: 'capitalize',
                            fontWeight: '600'
                          }}>
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))
          )}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default QuestionsList;
