import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, User, Bot, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { pageVariants, bubbleVariants } from '../motion/variants';

const InterviewChat = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState('in-progress');
  const [finalReport, setFinalReport] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Populate with first Claude message passed from setup router state
    if (location.state?.initialMessage) {
      setMessages([{ role: 'assistant', content: location.state.initialMessage }]);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || interviewStatus === 'completed') return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/api/interview/respond', {
        sessionId,
        userMessage
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
      
      if (res.data.status === 'completed') {
        setInterviewStatus('completed');
        setFinalReport({
          score: res.data.score,
          feedback: res.data.feedback
        });
        toast.success('Interview Session Completed!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Apologies, I encountered an error recording your response. Please try again or check the server logs.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderFinalReport = () => {
    if (!finalReport) return null;
    const { score, feedback } = finalReport;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="final-report" style={{ marginTop: '32px', padding: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', color: 'var(--text-primary)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle color="var(--color-success)" size={24} />
          Interview Completed - Final Report
        </h3>
        
        <div style={{ margin: '24px 0', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Overall Score: <span style={{ fontSize: '2rem', color: score >= 7 ? 'var(--color-success)' : 'var(--color-danger)' }}>{score}/10</span>
        </div>
        
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '24px' }}>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-primary)' }}><strong>Summary:</strong> {feedback?.summary}</p>
        </div>
        
        {feedback?.strengths && feedback.strengths.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <strong style={{ color: 'var(--color-success-text)', fontSize: '1.1rem' }}>Strengths:</strong>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '8px' }}>
              {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {feedback?.weaknesses && feedback.weaknesses.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <strong style={{ color: 'var(--color-danger-text)', fontSize: '1.1rem' }}>Areas for Improvement:</strong>
            <ul style={{ paddingLeft: '24px', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '8px' }}>
              {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <Link to="/interview" style={{ padding: '12px 24px', backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>
            New Interview
          </Link>
          <Link to="/dashboard" style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>
            Return to Dashboard
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="interview-chat-container" style={{ maxWidth: '900px', margin: '24px auto', height: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <header style={{ padding: '16px 24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>AI Mock Interview</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Session ID: {sessionId.substring(0,8)}...</p>
        </div>
        <div>
           <span style={{ 
             padding: '6px 12px', 
             backgroundColor: interviewStatus === 'completed' ? 'var(--color-success-bg)' : 'var(--color-accent-bg)', 
             color: interviewStatus === 'completed' ? 'var(--color-success-text)' : 'var(--color-accent-text)', 
             borderRadius: 'var(--radius-full)', 
             fontSize: '0.85rem', 
             fontWeight: 600 
           }}>
             {interviewStatus === 'in-progress' ? '● In Progress' : '✓ Completed'}
           </span>
        </div>
      </header>

      <div className="chat-window" style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '16px' }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div 
               custom={isUser}
               variants={bubbleVariants}
               initial="hidden"
               animate="visible"
               key={idx} 
               style={{ 
                 display: 'flex', 
                 flexDirection: isUser ? 'row-reverse' : 'row',
                 gap: '12px',
                 alignItems: 'flex-start',
                 alignSelf: isUser ? 'flex-end' : 'flex-start',
                 maxWidth: '85%'
               }}
            >
              <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', backgroundColor: isUser ? 'var(--color-primary)' : 'var(--bg-card-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isUser ? 'white' : 'var(--text-secondary)', border: `1px solid ${isUser ? 'transparent' : 'var(--border)'}` }}>
                {isUser ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div 
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: 'var(--radius-lg)', 
                  borderTopLeftRadius: isUser ? 'var(--radius-lg)' : 0, 
                  borderTopRightRadius: isUser ? 0 : 'var(--radius-lg)',
                  backgroundColor: isUser ? 'var(--color-primary)' : 'var(--bg-card)', 
                  color: isUser ? 'white' : 'var(--text-primary)', 
                  border: isUser ? 'none' : '1px solid var(--border)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  lineHeight: 1.5,
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            </motion.div>
          )
        })}
        
        {loading && (
          <motion.div variants={bubbleVariants} custom={false} initial="hidden" animate="visible" style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-card-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              <Bot size={18} />
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', borderTopLeftRadius: 0, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
        {interviewStatus === 'completed' && renderFinalReport()}
      </div>

      {interviewStatus === 'in-progress' && (
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your answer here... (Shift+Enter for newline)"
            onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleSend(e);
               }
            }}
            style={{ 
              flex: 1, 
              padding: '16px 20px', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border)', 
              backgroundColor: 'var(--bg-surface)', 
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all var(--duration-fast)',
              resize: 'none',
              height: '56px',
              fontFamily: 'inherit'
            }}
            autoFocus
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
          <motion.button 
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            type="submit" 
            disabled={loading || !input.trim()}
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)', 
              color: 'white', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1,
              flexShrink: 0
            }}
          >
            <Send size={20} />
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default InterviewChat;
