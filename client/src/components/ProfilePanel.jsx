import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Star, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ProfilePanel = () => {
  const { isProfileOpen, setIsProfileOpen, user, refreshProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [usage, setUsage] = useState(null);
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    college: '',
    targetRole: '',
    linkedIn: '',
    github: ''
  });

  useEffect(() => {
    if (user && isProfileOpen) {
      setEditForm({
        name: user.name || '',
        bio: user.profile?.bio || '',
        college: user.profile?.college || '',
        targetRole: user.profile?.targetRole || '',
        linkedIn: user.profile?.linkedIn || '',
        github: user.profile?.github || ''
      });
      fetchUsage();
    }
  }, [user, isProfileOpen]);

  const fetchUsage = async () => {
    try {
      const res = await api.get('/api/user/usage');
      setUsage(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleSaveProfile = async () => {
    try {
      await api.put('/api/user/profile', editForm);
      toast.success('Profile updated successfully');
      await refreshProfile();
      setIsEditing(false);
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm("Are you sure? You'll lose Pro access at the end of your billing cycle.")) {
      try {
        await api.post('/api/user/cancel');
        toast.success("Subscription cancellation scheduled");
        await refreshProfile();
      } catch (e) {
        toast.error('Failed to cancel subscription');
      }
    }
  };

  const tabs = ['profile', 'subscription', 'usage', 'settings'];
  const plan = user.subscription?.plan || 'free';
  const status = user.subscription?.status || 'active';

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 99, backdropFilter: 'blur(2px)'
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              width: '100%', maxWidth: '420px',
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border)',
              zIndex: 100, display: 'flex', flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px', position: 'relative', borderBottom: '1px solid var(--border)' }}>
              <button 
                onClick={() => setIsProfileOpen(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '28px', fontWeight: 600, marginBottom: '16px'
                }}>
                  {getInitials(user.name)}
                </div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</h2>
                <p style={{ margin: '4px 0 12px', fontSize: '13px', color: 'var(--text-muted)' }}>{user.email}</p>
                
                <div style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  backgroundColor: plan === 'pro' ? 'var(--color-primary)' : 'var(--color-accent)',
                  color: 'white'
                }}>
                  {plan === 'pro' && <Star size={12} fill="currentColor" />}
                  {plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', position: 'relative' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '14px', fontWeight: activeTab === tab ? 600 : 500,
                    color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textTransform: 'capitalize', position: 'relative'
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tabIndicator"
                      style={{
                        position: 'absolute', bottom: 0, left: '10%', right: '10%',
                        height: '2px', backgroundColor: 'var(--color-primary)'
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '24px', flex: 1 }}>
              {activeTab === 'profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Personal Info</h3>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Edit Profile</button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Full Name" style={inputStyle} />
                      <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} placeholder="Bio" rows={2} style={{...inputStyle, resize: 'none'}} />
                      <input value={editForm.college} onChange={e => setEditForm({...editForm, college: e.target.value})} placeholder="College / Company" style={inputStyle} />
                      <select value={editForm.targetRole} onChange={e => setEditForm({...editForm, targetRole: e.target.value})} style={inputStyle}>
                        <option value="">Select Target Role</option>
                        <option value="Frontend Dev">Frontend Dev</option>
                        <option value="Backend Dev">Backend Dev</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="Data Engineer">Data Engineer</option>
                        <option value="DevOps">DevOps</option>
                        <option value="DSA Focus">DSA Focus</option>
                      </select>
                      <input value={editForm.linkedIn} onChange={e => setEditForm({...editForm, linkedIn: e.target.value})} placeholder="LinkedIn URL" style={inputStyle} />
                      <input value={editForm.github} onChange={e => setEditForm({...editForm, github: e.target.value})} placeholder="GitHub URL" style={inputStyle} />
                      
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button onClick={handleSaveProfile} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                        <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <ReadField label="Full Name" value={user.name} />
                      <ReadField label="Bio" value={user.profile?.bio} />
                      <ReadField label="College / Company" value={user.profile?.college} />
                      <ReadField label="Target Role" value={user.profile?.targetRole} />
                      <ReadField label="LinkedIn" value={user.profile?.linkedIn} link />
                      <ReadField label="GitHub" value={user.profile?.github} link />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'subscription' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {plan === 'free' ? (
                    <>
                      <div style={{ padding: '20px', backgroundColor: 'var(--color-accent-bg)', borderLeft: '3px solid var(--color-accent)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <Lock color="var(--color-accent)" size={20} />
                          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px' }}>You're on the Free Plan</h3>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Upgrade to Pro and unlock everything.</p>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <div>Feature</div><div>Free</div><div>Pro</div>
                        </div>
                        <FeatureRow feature="Coding Qs/day" free="5" pro="Unlimited" />
                        <FeatureRow feature="MCQs/day" free="20" pro="Unlimited" />
                        <FeatureRow feature="Mock Interviews" free="3/mo" pro="Unlimited" />
                        <FeatureRow feature="Progress analytics" free="Basic" pro="Full" />
                        <FeatureRow feature="Resume-based AI" free="✗" pro="✓" />
                      </div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{ width: '100%', padding: '14px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>
                        Upgrade to Pro — ₹299/month
                      </motion.button>
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>7-day free trial • Cancel anytime</p>
                    </>
                  ) : (
                    <>
                      {status === 'active' ? (
                        <div style={{ padding: '20px', backgroundColor: 'var(--color-success-bg)', borderLeft: '3px solid var(--color-success)', borderRadius: 'var(--radius-lg)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <Star color="var(--color-success)" size={20} />
                            <h3 style={{ margin: 0, color: 'var(--color-success-text)', fontSize: '16px' }}>You're on Pro</h3>
                          </div>
                          <p style={{ margin: 0, color: 'var(--color-success-text)', fontSize: '14px', opacity: 0.8 }}>All features unlocked. Keep crushing it.</p>
                        </div>
                      ) : (
                        <div style={{ padding: '20px', backgroundColor: 'var(--color-danger-bg)', borderLeft: '3px solid var(--color-danger)', borderRadius: 'var(--radius-lg)' }}>
                          <h3 style={{ margin: 0, color: 'var(--color-danger-text)', fontSize: '16px' }}>Pro plan ends soon</h3>
                          <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>Your subscription is scheduled to be cancelled.</p>
                        </div>
                      )}
                      
                      <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                          <span style={{ color: status === 'active' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>{status.toUpperCase()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Amount:</span>
                          <span style={{ color: 'var(--text-primary)' }}>₹299/month</span>
                        </div>
                      </div>

                      {status === 'active' && (
                        <button onClick={handleCancelSubscription} style={{ alignSelf: 'center', marginTop: 'auto', background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                          Cancel Subscription
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'usage' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {plan === 'pro' ? (
                    <div style={{ padding: '24px', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <CheckCircle color="var(--color-success)" size={32} />
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--color-success-text)', fontSize: '16px' }}>You're on Pro</h3>
                        <p style={{ margin: '4px 0 0', color: 'var(--color-success-text)', fontSize: '14px', opacity: 0.8 }}>No limits apply. Practice as much as you want.</p>
                      </div>
                    </div>
                  ) : usage ? (
                    <>
                      <UsageMeter title="Coding Questions" used={usage.codingQuestionsToday} limit={usage.codingQuestionsLimit} resetText="Resets tomorrow" />
                      <UsageMeter title="MCQ Practice" used={usage.mcqsToday} limit={usage.mcqsLimit} resetText="Resets tomorrow" />
                      <UsageMeter title="Mock Interviews" used={usage.mockInterviewsThisMonth} limit={usage.mockInterviewsLimit} resetText="Resets next month" />
                      
                      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Need more? <span style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>Upgrade to Pro</span> for unlimited access.
                      </p>
                    </>
                  ) : <p>Loading usage stats...</p>}
                </div>
              )}

              {activeTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Preferences</h3>
                    <ToggleRow title="Dark Mode" />
                    <ToggleRow title="Email Notifications" />
                    <ToggleRow title="Interview Reminders" />
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '8px 0' }} />
                  
                  <div>
                    <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--color-danger)' }}>Danger Zone</h3>
                    <button onClick={() => logout()} style={{ display: 'block', width: '100%', padding: '12px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, marginBottom: '12px' }}>
                      Sign Out
                    </button>
                    <button style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger-text)', cursor: 'pointer', fontWeight: 600 }}>
                      Delete Account
                    </button>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '32px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <p>Account ID: {user._id?.substring(0, 8)}...</p>
                    <p>PrepAI v1.0.0</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Subcomponents

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
  backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
};

const ReadField = ({ label, value, link }) => (
  <div>
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{label}</span>
    {value ? (
      link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          {value} <ExternalLink size={14} />
        </a>
      ) : <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{value}</span>
    ) : <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not provided</span>}
  </div>
);

const FeatureRow = ({ feature, free, pro }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
    <div style={{ color: 'var(--text-primary)' }}>{feature}</div>
    <div style={{ color: 'var(--text-secondary)' }}>{free}</div>
    <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{pro}</div>
  </div>
);

const UsageMeter = ({ title, used, limit, resetText }) => {
  const percent = Math.min(100, (used / limit) * 100);
  let color = 'var(--color-success)';
  if (percent > 60) color = 'var(--color-accent)';
  if (percent >= 90) color = 'var(--color-danger)';
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{title}</span>
        <span><strong style={{ color: 'var(--text-primary)' }}>{used}</strong> <span style={{ color: 'var(--text-muted)' }}>/ {limit}</span></span>
      </div>
      <div style={{ height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', backgroundColor: color }} />
      </div>
      {percent >= 100 && <div style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px', textAlign: 'right' }}>{resetText}</div>}
    </div>
  );
};

const ToggleRow = ({ title }) => {
  const [on, setOn] = useState(false); // mock state
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{title}</span>
      <div 
        onClick={() => setOn(!on)}
        style={{ 
          width: '40px', height: '24px', borderRadius: '12px', cursor: 'pointer',
          backgroundColor: on ? 'var(--color-primary)' : 'var(--border)',
          position: 'relative', transition: 'background-color 0.2s'
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white',
          position: 'absolute', top: '3px', left: on ? '19px' : '3px',
          transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );
};

export default ProfilePanel;
