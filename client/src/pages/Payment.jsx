import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRazorpay } from 'react-razorpay';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { pageVariants, fadeInUp } from '../motion/variants';
import { Shield, Lock, CreditCard, ChevronLeft } from 'lucide-react';

const Payment = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { Razorpay } = useRazorpay();
  const [loading, setLoading] = useState(false);

  // Extract billing cycle from query params ('yearly' or 'monthly')
  const queryParams = new URLSearchParams(location.search);
  const billingCycle = queryParams.get('billing') === 'yearly' ? 'yearly' : 'monthly';
  const amount = billingCycle === 'yearly' ? '₹3,299' : '₹299';
  const cycleText = billingCycle === 'yearly' ? 'Yearly' : 'Monthly';

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/payment/create-order', { 
        plan: 'pro', 
        billingCycle 
      });

      // Handle Mock Flow
      if (data.isMock) {
        toast.loading('Simulating Payment...', { id: 'mockMode' });
        setTimeout(async () => {
          try {
            const verifyReq = await api.post('/api/payment/verify', {
               razorpay_order_id: data.orderId,
               razorpay_payment_id: `mock_py_${Date.now()}`,
               razorpay_signature: 'mock_sig_123',
               plan: 'pro',
               billingCycle
            });

            if (verifyReq.data.success) {
              await refreshProfile();
              toast.dismiss('mockMode');
              toast.success('[Test Mode] Welcome to PrepAI Pro! All limits removed.', { icon: '🎉' });
              navigate('/dashboard');
            }
          } catch (e) {
             toast.dismiss('mockMode');
             toast.error(`Mock Checkout Failed: ${e?.response?.data?.message || e?.message || 'Unknown error'}`);
          } finally {
             setLoading(false);
          }
        }, 1500);
        return;
      }
      
      // Razorpay Checkout Flow
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'PrepAI',
        description: `Pro Plan — ${cycleText} Subscription`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyReq = await api.post('/api/payment/verify', {
               ...response,
               plan: 'pro',
               billingCycle
            });

            if (verifyReq.data.success) {
              await refreshProfile();
              toast.success('Welcome to PrepAI Pro! All limits removed.', { icon: '🎉' });
              navigate('/dashboard');
            }
          } catch (verificationError) {
             console.error(verificationError);
             toast.error(`Payment verification failed! ${verificationError?.message}`);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#4F46E5' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled.');
            // Route to dashboard if payment is cancelled intentionally 
            navigate('/dashboard');
          }
        }
      };

      const rzp = new Razorpay(options);
      
      rzp.on('payment.failed', function (response){
        toast.error('Payment failed: ' + response.error.description);
      });

      rzp.open();
    } catch (error) {
       console.error(error);
       toast.error(`Checkout failed: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
       setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={pageVariants} 
      initial="initial" 
      animate="animate" 
      exit="exit" 
      style={{ padding: '64px 24px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)' }}
    >
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '32px' }}
      >
        <ChevronLeft size={18} /> Cancel and return to Dashboard
      </button>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Complete your upgrade</h1>
        <p style={{ color: 'var(--text-secondary)' }}>You are upgrading to the PrepAI Pro plan.</p>
      </div>

      <motion.div 
        variants={fadeInUp}
        style={{ display: 'flex', flexDirection: 'column', gap: '32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '40px' }}
      >
        {/* Order Summary */}
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} style={{ color: 'var(--color-primary)' }} /> Order Summary
          </h3>
          
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PrepAI Pro — {cycleText}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{amount}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Billed Now</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{amount}</span>
            </div>
          </div>
        </div>

        {/* Benefits reminder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', opacity: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Shield size={16} /> 256-bit Secure Checkout
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CreditCard size={16} /> Instant Account Upgrade
          </div>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          style={{ width: '100%', padding: '16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '1.1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {loading ? 'Initializing Secure Checkout...' : `Pay ${amount} Securely`}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Payment;
