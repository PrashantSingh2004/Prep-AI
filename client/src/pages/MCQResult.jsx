import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { pageVariants, containerVariants, itemVariants } from '../motion/variants';

const MCQResult = () => {
  const location = useLocation();
  const { result } = location.state || {}; // { topic, score, totalQuestions, answers: [{ question, userOption, correctOption, isCorrect, explanation }] }

  if (!result) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No results found. Please take a quiz first.</p>
        <Link to="/mcq" style={{ color: 'var(--color-primary)' }}>Return to MCQ Home</Link>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  let feedback = '';
  let colorVar = '';
  if (percentage >= 80) { feedback = 'Excellent!'; colorVar = 'var(--color-success)'; }
  else if (percentage >= 60) { feedback = 'Good Job!'; colorVar = 'var(--color-accent)'; }
  else { feedback = 'Keep Practicing!'; colorVar = 'var(--color-danger)'; }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="result-container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div className="summary-card" style={{ padding: '40px 24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '32px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, textTransform: 'capitalize', color: 'var(--text-primary)', fontSize: '2rem' }}>{result.topic} Quiz Completed</h2>
        <motion.div 
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
           style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '160px', height: '160px', borderRadius: '50%', border: `8px solid ${colorVar}`, margin: '24px auto', backgroundColor: 'var(--bg-surface)' }}
        >
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: colorVar }}>{percentage}%</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{result.score} / {result.totalQuestions}</span>
        </motion.div>
        
        <h3 style={{ color: colorVar, fontSize: '1.5rem', marginBottom: '24px' }}>{feedback}</h3>
        
        <Link to="/mcq" style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'inline-block' }}>
          Back to Topics
        </Link>
      </div>

      <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '24px', color: 'var(--text-primary)' }}>Detailed Review</h3>
      
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {result.answers.map((ans, idx) => (
          <motion.div variants={itemVariants} key={idx} style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: `1px solid ${ans.isCorrect ? 'color-mix(in srgb, var(--color-success) 40%, transparent)' : 'color-mix(in srgb, var(--color-danger) 40%, transparent)'}`, borderRadius: 'var(--radius-lg)', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '2px' }}>
                {ans.isCorrect ? <Check color="var(--color-success)" size={24} /> : <X color="var(--color-danger)" size={24} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 16px 0', fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Q{idx + 1}: {ans.question}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                  <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: ans.isCorrect ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', color: ans.isCorrect ? 'var(--color-success-text)' : 'var(--color-danger-text)' }}>
                    <strong>Your Answer:</strong> {ans.userOption !== null ? ans.userOption : 'Skipped'}
                  </div>
                  {!ans.isCorrect && (
                    <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
                      <strong>Correct Answer:</strong> {ans.correctOption}
                    </div>
                  )}
                </div>

                {ans.explanation && (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-card-alt)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-primary-text)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Explanation:</strong> {ans.explanation}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MCQResult;
