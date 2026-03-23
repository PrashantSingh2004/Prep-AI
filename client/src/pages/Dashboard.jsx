import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { ActivityCalendar } from 'react-activity-calendar';
import { X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { pageVariants, containerVariants, itemVariants } from '../motion/variants';

// Internal animated number counter component
const AnimatedCount = ({ value, labelVariant = '' }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.2, ease: "easeOut" });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNudge, setShowNudge] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics/me');
        setAnalytics(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();

    // Check if nudge was dismissed recently
    const dismissedAt = localStorage.getItem('prepai_nudge_dismissed');
    if (dismissedAt) {
      const daysSince = (new Date() - new Date(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 3) setShowNudge(false);
    }
  }, []);

  const getLevelBadge = (solvedCount) => {
    if (solvedCount >= 50) return { label: 'Advanced', bgColor: 'var(--color-accent)', color: 'var(--color-accent-bg)' };
    if (solvedCount >= 10) return { label: 'Intermediate', bgColor: 'var(--color-primary)', color: 'var(--color-primary-bg)' };
    return { label: 'Beginner', bgColor: 'var(--color-success)', color: 'var(--color-success-bg)' };
  };

  if (loading) return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="skeleton" style={{ height: '80px', width: '100%', maxWidth: '1200px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
         <div className="skeleton" style={{ height: '120px' }} />
         <div className="skeleton" style={{ height: '120px' }} />
         <div className="skeleton" style={{ height: '120px' }} />
         <div className="skeleton" style={{ height: '120px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
         <div className="skeleton" style={{ height: '300px' }} />
         <div className="skeleton" style={{ height: '300px' }} />
      </div>
    </motion.div>
  );

  const { codingStats, mcqStats, interviewStats, activity } = analytics || {};
  const level = codingStats ? getLevelBadge(codingStats.solved) : { label: 'Beginner', bgColor: 'var(--color-success)', color: 'var(--color-success-bg)' };

  return (
    <motion.div 
       variants={pageVariants} initial="initial" animate="animate" exit="exit"
       className="dashboard-container" style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <header className="dashboard-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'white' }}>Welcome back, {user?.name}!</h1>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ backgroundColor: level.bgColor, color: level.color, padding: '4px 10px', borderRadius: 'var(--radius-lg)', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {level.label}
            </span>
            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔥 <AnimatedCount value={activity?.currentStreak || 0} /> Day Streak
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link to="/questions" style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontWeight: 500, display: 'inline-block' }}>Code</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link to="/mcq" style={{ padding: '8px 16px', backgroundColor: 'var(--color-secondary)', color: 'white', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontWeight: 500, display: 'inline-block' }}>MCQs</Link>
          </motion.div>
        </div>
      </header>

      {/* Upgrade Nudge (Free Users Only) */}
      {user?.subscription?.plan !== 'pro' && showNudge && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'var(--color-primary-bg)', 
            border: '1px solid rgba(99, 102, 241, 0.3)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
               Unlock unlimited access <span style={{ fontSize: '12px', padding: '2px 6px', background: 'var(--color-primary)', color: 'white', borderRadius: '4px' }}>PRO</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              5 coding Qs • 20 MCQs • 3 interviews — per day/month
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/pricing" style={{ background: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: 'var(--radius-md)', padding: '7px 14px', fontSize: '13px', fontWeight: 500 }}>
              Upgrade to Pro →
            </Link>
            <button 
              onClick={() => {
                localStorage.setItem('prepai_nudge_dismissed', new Date().toISOString());
                setShowNudge(false);
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Top Stats Row */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)', boxShadow: '0 1px 3px var(--border-strong)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Problems Solved</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            <AnimatedCount value={codingStats?.solved || 0} /> <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)'}}>/ {codingStats?.total || 0}</span>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-secondary)', boxShadow: '0 1px 3px var(--border-strong)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>MCQ Accuracy</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            <AnimatedCount value={Math.round(mcqStats?.overallAccuracy || 0)} />%
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary-text)', boxShadow: '0 1px 3px var(--border-strong)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interviews Avg</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
             <AnimatedCount value={Math.round(interviewStats?.avgScore || 0)} /> <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)'}}>/ 10</span>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-accent)', boxShadow: '0 1px 3px var(--border-strong)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quizzes Taken</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
             <AnimatedCount value={mcqStats?.totalQuizzes || 0} />
          </div>
        </motion.div>
      </motion.div>

      <div className="charts-grid responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Coding Difficulty Chart */}
        <div className="chart-container" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Solved by Difficulty</h3>
          <div style={{ height: '250px' }}>
            {codingStats?.byDifficulty && codingStats.solved > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={codingStats.byDifficulty}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'var(--bg-card-alt)'}} contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
                <div style={{ display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'var(--text-muted)'}}>Complete coding challenges to see data.</div>
             )}
          </div>
        </div>

        {/* MCQ Accuracy by Topic Chart */}
        <div className="chart-container" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', fontSize: '1.1rem' }}>MCQ Accuracy by Topic</h3>
          <div style={{ height: '250px' }}>
            {mcqStats?.topicAverages && mcqStats.topicAverages.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mcqStats.topicAverages}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="topic" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
                  <Line type="monotone" dataKey="accuracy" stroke="var(--color-secondary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
             ) : (
                <div style={{ display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'var(--text-muted)'}}>Take MCQ quizzes to see data.</div>
             )}
          </div>
        </div>
      </div>

      {/* Activity Map and Recent Feed */}
      <div className="activity-section responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="heatmap-container" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
           <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Activity Heatmap (Last 30 Days)</h3>
           {activity?.heatmapData && activity.heatmapData.length > 0 ? (
             <div style={{ minWidth: '600px', display: 'flex', justifyContent: 'center' }}>
               <ActivityCalendar 
                 data={activity.heatmapData} 
                 labels={{
                   totalCount: '{{count}} activities in the last 30 days',
                 }}
                 theme={{
                   light: ['var(--bg-card-alt)', 'var(--color-success-bg)', '#86EFAC', '#22C55E', '#166534'],
                   dark: ['var(--bg-card-alt)', '#052E16', '#166534', '#22C55E', '#86EFAC']
                 }}
                 blockSize={14}
                 blockMargin={5}
                 hideMonthLabels={true}
                 colorScheme={document.body.classList.contains('dark') ? 'dark' : 'light'}
               />
             </div>
           ) : (
             <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No activity in the last 30 days.</div>
           )}
        </div>

        <div className="recent-feed-container" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
           <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Recent Activity</h3>
           <div className="feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {activity?.recentFeed && activity.recentFeed.length > 0 ? (
               activity.recentFeed.map((item, idx) => {
                 let bgColor, color, label;
                 if (item.type === 'coding') { bgColor = 'var(--color-primary-bg)'; color = 'var(--color-primary-text)'; label = 'Coding Problem'; }
                 else if (item.type === 'mcq') { bgColor = 'var(--color-success-bg)'; color = 'var(--color-success-text)'; label = 'MCQ Quiz'; }
                 else { bgColor = 'var(--color-secondary-bg)'; color = 'var(--color-secondary-text)'; label = 'Mock Interview'; }
                 
                 return (
                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1, duration: 0.3 }} key={idx} style={{ padding: '12px', backgroundColor: bgColor, color: color, borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <strong>{label}</strong>
                     <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500 }}>
                       {new Date(item.date).toLocaleDateString()}
                     </div>
                   </motion.div>
                 )
               })
             ) : (
               <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No recent activity.</div>
             )}
           </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="quiz-history-section" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Recent Quiz History</h3>
        {mcqStats?.history && mcqStats.history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mcqStats.history.map((quiz, idx) => (
              <div key={idx} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{quiz.topic} Quiz</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(quiz.takenAt).toLocaleDateString()} at {new Date(quiz.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ padding: '6px 16px', borderRadius: '20px', backgroundColor: quiz.score / quiz.totalQuestions >= 0.6 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', color: quiz.score / quiz.totalQuestions >= 0.6 ? 'var(--color-success-text)' : 'var(--color-danger-text)', fontWeight: 'bold' }}>
                  {quiz.score} / {quiz.totalQuestions}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No quizzes taken yet.</div>
        )}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .responsive-grid {
              grid-template-columns: 1fr !important;
            }
            .responsive-grid-3 {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </motion.div>
  );
};

export default Dashboard;
