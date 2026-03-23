import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { pageVariants } from '../motion/variants';
import LimitGate from '../components/LimitGate';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0
  })
};

const MCQQuiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/api/mcq/quiz?topic=${encodeURIComponent(topicId)}`);
        setQuestions(res.data);
      } catch (error) {
        toast.error('Failed to load quiz.');
        console.error('Failed to load quiz', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [topicId]);

  useEffect(() => {
    if (loading || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, loading, questions]);

  const handleOptionSelect = (optionIdx) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIdx
    });
  };

  const handleNext = () => {
    setDirection(1);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Format answers array: [{ questionId, selectedAnswer: index }]
    const answers = questions.map((q, index) => ({
      questionId: q._id,
      selectedAnswer: selectedAnswers[index] !== undefined ? selectedAnswers[index] : -1
    }));

    try {
      const res = await api.post('/api/mcq/submit', {
        topic: topicId,
        answers
      });
      // Redirect to results passing the result data via router state
      navigate('/mcq/results', { state: { result: res.data } });
    } catch (error) {
      toast.error('Failed to submit quiz.');
      console.error('Submit failed', error);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
       <div className="skeleton" style={{ height: '24px', width: '200px', marginBottom: '24px' }} />
       <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-lg)' }} />
    </motion.div>
  );

  if (questions.length === 0) return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>No questions available for this topic.</div>;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timerStr = `${m}:${s < 10 ? '0' : ''}${s}`;

  return (
    <LimitGate type="mcq">
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="quiz-container" style={{ padding: '16px 24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', textTransform: 'capitalize' }}>{topicId} Quiz</h2>
        <div style={{ padding: '6px 16px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-lg)', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>
          {timerStr}
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ backgroundColor: 'var(--bg-card-alt)', height: '8px', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '4px' }} 
        />
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: '400px' }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            style={{ position: 'absolute', width: '100%' }}
          >
            <div className="question-card" style={{ padding: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--text-primary)', fontSize: '1.25rem', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>{currentIndex + 1}.</span> 
                {currentQ.question}
              </h3>
              
              <div className="options" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      key={idx} 
                      onClick={() => handleOptionSelect(idx)}
                      style={{ 
                        padding: '16px', 
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`, 
                        borderRadius: 'var(--radius-md)', 
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--color-primary-bg)' : 'var(--bg-surface)',
                        color: isSelected ? 'var(--color-primary-text)' : 'var(--text-primary)',
                        fontWeight: isSelected ? 600 : 400,
                        transition: 'background var(--duration-fast), border-color var(--duration-fast)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent' }}>
                         {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
                      </div>
                      {opt}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="quiz-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          style={{ padding: '10px 24px', backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.5 : 1, fontWeight: 600 }}
        >
          Previous
        </button>
        
        {isLast ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit} 
            disabled={submitting}
            style={{ padding: '10px 24px', backgroundColor: 'var(--color-success)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </motion.button>
        ) : (
          <button 
            onClick={handleNext} 
            style={{ padding: '10px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}
          >
            Next
          </button>
        )}
      </div>

      </motion.div>
    </LimitGate>
  );
};

export default MCQQuiz;
