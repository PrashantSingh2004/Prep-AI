import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { pageVariants } from '../motion/variants';
import LimitGate from '../components/LimitGate';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/api/questions/${id}`);
        setQuestion(res.data);
      } catch (error) {
        toast.error('Failed to load question details.');
        console.error('Failed to fetch detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="question-layout" style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', height: 'calc(100vh - 104px)' }}>
      <div className="skeleton" style={{ height: '100%', borderRadius: 'var(--radius-lg)' }} />
    </motion.div>
  );

  if (!question) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Question not found.</div>;

  return (
    <>
      <style>
        {`
          .question-layout {
            max-width: 900px;
            margin: 0 auto;
            padding: 24px;
            min-height: calc(100vh - 104px);
          }
          
          .desc-panel {
            background-color: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 32px;
          }

          .primary-btn {
            padding: 8px 16px;
            background-color: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-weight: 600;
          }
        `}
      </style>

      <LimitGate type="coding">
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="question-layout">
        
        <div className="desc-panel">
          <motion.button 
            whileHover={{ x: -4 }}
            onClick={() => navigate('/questions')} 
            style={{ marginBottom: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, fontWeight: 500 }}
          >
            ← Back to List
          </motion.button>
          
          <h2 style={{ marginTop: 0, color: 'var(--text-primary)', fontSize: '2rem' }}>{question.title}</h2>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
            <span style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontWeight: 600, textTransform: 'capitalize' }}>
              {question.difficulty}
            </span>
            {question.tags?.map(tag => (
              <span key={tag} style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary-text)', fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ lineHeight: '1.7', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
             {/* Simple formatting for demo: assume newlines are paragraphs */}
             {question.description.split('\\n').map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', color: 'var(--text-primary)', marginBottom: '20px' }}>Examples:</h3>
            {question.examples?.map((ex, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-card-alt)', padding: '20px', borderRadius: 'var(--radius-md)', margin: '16px 0', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                <div style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--color-primary)' }}>Input:</strong> {ex.input}</div>
                <div><strong style={{ color: 'var(--color-primary)' }}>Output:</strong> {ex.output}</div>
                {ex.explanation && <div style={{ marginTop: '12px', color: 'var(--text-secondary)', borderTop: '1px dashed var(--border)', paddingTop: '12px' }}><em>Explanation: {ex.explanation}</em></div>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </LimitGate>
    </>
  );
};

export default QuestionDetail;
