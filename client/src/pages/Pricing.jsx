import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { pageVariants, fadeInUp } from '../motion/variants';
import { Check, X, Shield, Lock, RefreshCw, Star, ArrowLeft } from 'lucide-react';

const Pricing = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [yearly, setYearly] = useState(false); // Monthly vs Yearly toggle

  const isPro = Boolean(user?.subscription?.plan === 'pro' && user?.subscription?.status === 'active');

  const handlePayment = async () => {
    if (isPro) {
      toast.success("You're already on the Pro plan!");
      return navigate('/dashboard');
    }
    // Route to checkout page instead of popping up razorpay instantly
    navigate(`/payment?billing=${yearly ? 'yearly' : 'monthly'}`);
  };

  return (
    <motion.div 
      variants={pageVariants} 
      initial="initial" 
      animate="animate" 
      exit="exit" 
      style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}
    >
      {/* ─── TOP SECTION ─── */}
      <motion.button 
        whileHover={{ x: -3 }}
        onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '32px' }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </motion.button>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Upgrade your prep. Unlock everything.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          One plan. No confusion. Cancel anytime.
        </p>

        {/* Toggle Pill */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: '100px', margin: '32px auto 0' }}>
          <button 
            onClick={() => setYearly(false)}
            style={{ padding: '8px 24px', borderRadius: '100px', background: !yearly ? 'var(--color-primary)' : 'transparent', color: !yearly ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
          >
            Monthly
          </button>
          <button 
            onClick={() => setYearly(true)}
            style={{ padding: '8px 24px', borderRadius: '100px', background: yearly ? 'var(--color-primary)' : 'transparent', color: yearly ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
          >
            Yearly <span style={{ fontSize: '0.75rem', background: 'white', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>Save 8%</span>
          </button>
        </div>
      </div>

      {/* ─── PLAN CARDS ─── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginBottom: '64px' }}>
        
        {/* FREE CARD */}
        <motion.div 
          variants={fadeInUp}
          style={{ width: '320px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'flex', flexDirection: 'column' }}
        >
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Free</span>
          <div style={{ margin: '16px 0 32px' }}>
            <span style={{ fontSize: '48px', fontWeight: 700, color: 'var(--text-primary)' }}>₹0</span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '4px' }}>/forever</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, marginBottom: '32px' }}>
            {/* Features Included */}
            {['5 coding questions / day', '20 MCQs / day', '3 mock interviews / month', 'Basic progress tracking'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check size={18} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
            {/* Features Excluded */}
            {['Unlimited access', 'Enhanced AI feedback', 'Resume-based questions', 'Priority responses'].map((f, i) => (
              <div key={`ex-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
                <X size={18} style={{ color: 'var(--color-danger)' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{f}</span>
              </div>
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            style={{ width: '100%', padding: '14px 24px', background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', fontWeight: 600, cursor: 'pointer' }}
          >
            Continue with Free
          </motion.button>
          {!isPro && (
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
              You are currently on this plan
            </p>
          )}
        </motion.div>

        {/* PRO CARD */}
        <motion.div 
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          style={{ width: '340px', background: 'var(--color-primary-bg)', border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-xl)', padding: '32px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)' }}
        >
          {/* Badge */}
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: 'white', padding: '4px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} style={{ display: 'flex' }}>
              <Star size={14} fill="white" />
            </motion.div>
            Most Popular
          </div>

          <span style={{ fontSize: '14px', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Pro</span>
          
          <div style={{ margin: '16px 0 8px', position: 'relative', height: '60px' }}>
            <AnimatePresence mode='wait'>
              <motion.div 
                key={yearly ? 'year' : 'month'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute' }}
              >
                <span style={{ fontSize: '48px', fontWeight: 700, color: 'var(--color-primary)' }}>{yearly ? '₹275' : '₹299'}</span>
                <span style={{ fontSize: '14px', color: 'var(--color-primary)', opacity: 0.7, marginLeft: '4px' }}>/month</span>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '32px', minHeight: '18px' }}>
              {yearly && "₹3,299 billed annually"}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, marginBottom: '32px' }}>
            {['Unlimited coding questions', 'Unlimited MCQs', 'Unlimited mock interviews', 'Full analytics dashboard', 'Enhanced AI feedback', 'Resume-based question generation', 'Priority AI responses', 'Interview history & review', 'Cancel anytime'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{f}</span>
              </div>
            ))}
          </div>

          {isPro ? (
            <motion.button 
              disabled
              style={{ width: '100%', padding: '14px 24px', background: 'transparent', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: 'var(--radius-lg)', fontWeight: 600, opacity: 0.8 }}
            >
              You're already on Pro ✓
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePayment}
              disabled={loading}
              style={{ width: '100%', padding: '14px 24px', background: 'var(--color-primary)', border: 'none', color: 'white', borderRadius: 'var(--radius-lg)', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontSize: '16px' }}
            >
              {loading ? 'Initializing Checkout...' : 'Start 7-Day Free Trial'}
            </motion.button>
          )}

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
             <Lock size={12} /> Secured by Razorpay • No hidden charges
          </div>
        </motion.div>
      </div>

      {/* ─── TRUST BADGES ROW ─── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginBottom: '64px', opacity: 0.8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><Shield size={20} style={{ color: 'var(--text-secondary)' }} /> <span style={{ fontSize: '12px' }}>256-bit SSL Encryption</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><Lock size={20} style={{ color: 'var(--text-secondary)' }} /> <span style={{ fontSize: '12px' }}>Powered by Razorpay</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><RefreshCw size={20} style={{ color: 'var(--text-secondary)' }} /> <span style={{ fontSize: '12px' }}>Cancel anytime, instantly</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><Star size={20} style={{ color: 'var(--text-secondary)' }} /> <span style={{ fontSize: '12px' }}>10,000+ developers trust us</span></div>
      </div>

      {/* ─── FAQ MINI SECTION ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Will I be charged after the free trial?</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Yes, after 7 days your card is charged based on your billed cycle. Cancel before that and you'll never be charged.</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>What happens to my data if I downgrade?</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>All your progress, questions, and interview history are saved. You just lose access to unlimited usage limits.</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Can I use PrepAI on mobile?</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Yes — PrepAI is exceptionally responsive and works interchangeably on any tablet or smartphone device.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
