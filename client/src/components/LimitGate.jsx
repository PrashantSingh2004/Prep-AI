import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import api from '../services/api';

const LimitGate = ({ type, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  // Unpack plan safely
  const isPro = user?.subscription?.plan === 'pro' && user?.subscription?.status === 'active';

  // Config map based on component injection type
  const config = {
    coding: {
      title: "You've hit today's limit",
      description: "Free users can solve 5 questions per day. Resets at midnight.",
      limitKey: 'codingQuestionsLimit',
      usedKey: 'codingQuestionsToday',
    },
    mcq: {
      title: "You've hit today's limit",
      description: "Free users can attempt 20 MCQs per day. Resets at midnight.",
      limitKey: 'mcqsLimit',
      usedKey: 'mcqsToday',
    },
    interview: {
      title: "You've hit this month's limit",
      description: "Free users get 3 mock interviews per month. Resets on the 1st.",
      limitKey: 'mockInterviewsLimit',
      usedKey: 'mockInterviewsThisMonth',
      isMonthly: true
    }
  }[type];

  useEffect(() => {
    // Pro bypasses completely
    if (isPro) {
      setLoading(false);
      return;
    }

    // Fetch up-to-date usage specific to the gated limit
    const fetchUsage = async () => {
      try {
        const { data } = await api.get('/api/user/usage');
        setUsageData(data);
      } catch (err) {
        console.error('Failed to load usage limits for gate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [isPro, type]);

  useEffect(() => {
    if (!usageData || isPro) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (config.isMonthly) {
         // Next month's 1st
         const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
         setTimeLeft(`Resets on ${nextMonth.toLocaleDateString([], { month: 'short', day: 'numeric' })}`);
      } else {
         // Midnight tonight
         const midnight = new Date(now);
         midnight.setHours(24, 0, 0, 0);
         const diff = midnight - now;

         const h = Math.floor(diff / (1000 * 60 * 60));
         const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
         const s = Math.floor((diff % (1000 * 60)) / 1000);
         setTimeLeft(`Resets in: ${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [usageData, config, isPro]);


  if (loading) {
    return <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading verification...</div>;
  }

  // If pro, or limits not fetched properly, or usage < limit => render normally
  if (isPro || !usageData) {
     return <>{children}</>;
  }

  const allowedLimit = usageData[config.limitKey];
  const usedAmount = usageData[config.usedKey];
  const isBlocked = usedAmount >= allowedLimit;
  const isSoftWarning = usedAmount >= (allowedLimit * 0.8) && usedAmount < allowedLimit; // Last 20%

  if (isBlocked) {
    return (
      <div style={{ padding: '48px', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '460px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
        >
          {/* Shaking Lock */}
          <motion.div
             animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
             transition={{ duration: 0.5, delay: 0.2 }}
             style={{ display: 'inline-flex', padding: '16px', background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', borderRadius: '50%', marginBottom: '24px' }}
          >
             <Lock size={40} style={{ color: 'var(--color-danger)', opacity: 0.9 }} />
          </motion.div>

          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>{config.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 24px', lineHeight: 1.5 }}>
            {config.description}
          </p>

          {/* Progress Bar Label (Full Red) */}
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Usage Capacity</span>
              <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{usedAmount} / {allowedLimit} used</span>
            </div>
            {/* The Red track line */}
            <div style={{ width: '100%', height: '8px', background: 'color-mix(in srgb, var(--color-danger) 20%, var(--bg-surface))', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '100%' }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: '100%', background: 'var(--color-danger)' }} 
              />
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 500, fontFamily: 'monospace' }}>
              {timeLeft}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/pricing')}
              style={{ padding: '14px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Upgrade to Pro — Remove all limits
            </motion.button>
            <motion.button
              whileHover={{ background: 'var(--bg-surface)' }}
              onClick={() => navigate('/dashboard')}
              style={{ padding: '14px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Wait for reset — continue free
            </motion.button>
          </div>

          <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Pro users get unlimited access. Cancel anytime. Starting at ₹299/month.
          </p>

        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isSoftWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: 'color-mix(in srgb, var(--color-warning) 10%, transparent)', color: 'var(--color-warning)', padding: '12px 24px', position: 'relative', borderBottom: '2px solid var(--color-warning)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                ⚠️ You've used {usedAmount} of {allowedLimit} free items {config.isMonthly ? 'this month' : 'today'}. {allowedLimit - usedAmount} remaining.
              </span>
              <button 
                onClick={() => navigate('/pricing')}
                style={{ background: 'var(--color-warning)', color: '#451a03', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Upgrade
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default LimitGate;
