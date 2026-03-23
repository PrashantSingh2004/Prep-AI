import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const fetchUserCount = async () => {
      try {
        const res = await api.get('/api/user/count');
        setUserCount(res.data.count || 0);
      } catch (err) {
        console.error('Failed to fetch user count', err);
      }
    };
    
    fetchUserCount();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleAccordion = (e) => {
    const content = e.currentTarget.nextElementSibling;
    const icon = e.currentTarget.querySelector('.accordion-icon');
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
      content.style.maxHeight = '0px';
      icon.style.transform = 'rotate(0deg)';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      icon.style.transform = 'rotate(45deg)';
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    try {
      await api.post('/api/user/feedback', feedback);
      toast.success('Thank you for your feedback!');
      setFeedback({ name: '', email: '', message: '' });
    } catch (error) {
       toast.error('Failed to submit feedback. Try again.');
    } finally {
       setFeedbackLoading(false);
    }
  };

  return (
    <div className="landing-root">
      <style>
        {`
          :root {
            --bg-color: #030308;
            --surface: rgba(15, 15, 25, 0.7);
            --surface-hover: rgba(25, 25, 45, 0.8);
            --border: rgba(255, 255, 255, 0.08);
            --border-highlight: rgba(99, 102, 241, 0.3);
            --primary: #6366F1;
            --primary-glow: rgba(99, 102, 241, 0.4);
            --secondary: #14B8A6;
            --secondary-glow: rgba(20, 184, 166, 0.4);
            --accent: #F59E0B;
            --text-main: #FFFFFF;
            --text-muted: #94A3B8;
            --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: var(--font-sans);
            margin: 0;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
          }

          .landing-root {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            background: radial-gradient(circle at 50% 0%, #1a1a3a 0%, var(--bg-color) 40%);
          }

          /* Ambient Background Orbs */
          .ambient-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(120px);
            z-index: 0;
            opacity: 0.5;
            pointer-events: none;
            animation: float-orb 20s infinite ease-in-out alternate;
          }
          .orb-1 { width: 600px; height: 600px; top: -10%; left: -10%; background: var(--primary-glow); }
          .orb-2 { width: 500px; height: 500px; top: 40%; right: -10%; background: var(--secondary-glow); animation-delay: -5s; }
          .orb-3 { width: 400px; height: 400px; bottom: -10%; left: 20%; background: rgba(245, 158, 11, 0.2); animation-delay: -10s; }

          @keyframes float-orb {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(50px, 50px) scale(1.1); }
          }

          /* General Layout Constraints */
          .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 2rem;
            position: relative;
            z-index: 10;
          }

          /* Typography */
          h1, h2, h3, h4 { margin: 0; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; color: white !important; }
          p { line-height: 1.6; margin: 0; }
          
          .text-gradient {
            background: linear-gradient(135deg, #FFFFFF 0%, #A5B4FC 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .text-gradient-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          /* Reusable UI Components */
          .glass-card {
            background: var(--surface);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border);
            border-radius: 1.5rem;
            transition: all 0.3s ease;
          }

          .glass-card:hover {
            border-color: var(--border-highlight);
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px var(--primary-glow);
          }

          .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, var(--primary), #818CF8);
            color: white;
            font-weight: 600;
            padding: 1rem 2rem;
            border-radius: 1rem;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px var(--primary-glow);
            font-size: 1.125rem;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px var(--primary-glow);
            filter: brightness(1.1);
          }

          .btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: var(--surface);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            color: var(--text-main);
            font-weight: 600;
            padding: 1rem 2rem;
            border-radius: 1rem;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.125rem;
          }

          .btn-secondary:hover {
            background: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.2);
            transform: translateY(-2px);
          }

          /* Navigation */
          .navbar {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 100;
            padding: 1rem 0;
            transition: all 0.3s ease;
          }
          .navbar.scrolled {
            background: rgba(3, 3, 8, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border);
            padding: 0.75rem 0;
          }
          .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .nav-logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
          }
          .nav-links a {
            color: var(--text-muted);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: color 0.2s;
          }
          .nav-links a:hover {
            color: white;
          }
          .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
          }
          .nav-auth {
             display: flex;
             align-items: center;
             gap: 1rem;
          }

          /* Hero Section */
          .hero {
            padding-top: 10rem;
            padding-bottom: 6rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
          }
          .hero-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
          }
          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(20, 184, 166, 0.1);
            border: 1px solid rgba(20, 184, 166, 0.2);
            border-radius: 2rem;
            color: var(--secondary);
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 2rem;
          }
          .pulse-dot {
            width: 8px; height: 8px;
            background: var(--secondary);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--secondary);
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
          }
          .hero-title {
            font-size: clamp(3rem, 5vw, 4.5rem);
            margin-bottom: 1.5rem;
          }
          .hero-subtitle {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 500px;
            margin-bottom: 2.5rem;
          }
          .hero-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 3rem;
          }
          .hero-social {
             display: flex;
             align-items: center;
             gap: 1.5rem;
          }
          .avatars {
             display: flex;
             margin-left: -0.5rem;
          }
          .avatar {
             width: 40px; height: 40px;
             border-radius: 50%;
             border: 2px solid var(--bg-color);
             display: flex; align-items: center; justify-content: center;
             font-size: 0.75rem; font-weight: bold; color: white;
             margin-left: -0.5rem;
          }
          
          /* Hero Visual Card */
          .hero-visual {
             position: relative;
             perspective: 1000px;
          }
          .mockup-card {
             background: rgba(15, 15, 25, 0.6);
             backdrop-filter: blur(20px);
             border: 1px solid rgba(255,255,255,0.1);
             border-radius: 2rem;
             padding: 2rem;
             box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
             transform: rotateY(-10deg) rotateX(5deg);
             transition: transform 0.5s ease;
          }
          .mockup-card:hover {
             transform: rotateY(-5deg) rotateX(2deg) translateY(-10px);
          }
          .mockup-header {
             display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
          }
          .mock-chat-bubble {
             padding: 1rem 1.25rem;
             border-radius: 1rem;
             margin-bottom: 1rem;
             font-size: 0.95rem;
             max-width: 85%;
             line-height: 1.5;
          }
          .bubble-ai {
             background: rgba(99, 102, 241, 0.1);
             border: 1px solid rgba(99, 102, 241, 0.2);
             border-top-left-radius: 0.25rem;
          }
          .bubble-user {
             background: rgba(20, 184, 166, 0.1);
             border: 1px solid rgba(20, 184, 166, 0.2);
             border-top-right-radius: 0.25rem;
             margin-left: auto;
          }

          /* Section Headings */
          .section-header {
             text-align: center;
             margin-bottom: 4rem;
          }
          .section-title {
             font-size: clamp(2.5rem, 4vw, 3.5rem);
             margin-bottom: 1rem;
          }
          .section-subtitle {
             font-size: 1.25rem;
             color: var(--text-muted);
          }

          /* How It Works Grid */
          .section-padding { padding: 8rem 0; }
          .how-it-works-grid {
             display: grid;
             grid-template-columns: repeat(3, 1fr);
             gap: 2rem;
          }
          .step-card {
             padding: 2.5rem;
             position: relative;
             overflow: hidden;
          }
          .step-number {
             position: absolute;
             top: 1rem; right: 1.5rem;
             font-size: 6rem;
             font-weight: 900;
             opacity: 0.05;
             line-height: 1;
          }
          .step-icon {
             width: 64px; height: 64px;
             border-radius: 1rem;
             display: flex; align-items: center; justify-content: center;
             margin-bottom: 2rem;
             font-size: 2rem;
          }
          .step-1 .step-icon { background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.2); box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
          .step-2 .step-icon { background: rgba(20, 184, 166, 0.1); color: var(--secondary); border: 1px solid rgba(20, 184, 166, 0.2); box-shadow: 0 0 20px rgba(20, 184, 166, 0.2); }
          .step-3 .step-icon { background: rgba(245, 158, 11, 0.1); color: var(--accent); border: 1px solid rgba(245, 158, 11, 0.2); box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); }

          /* Compare Grid */
          .compare-grid {
             display: grid;
             grid-template-columns: 1fr 1fr;
             gap: 2rem;
          }
          .compare-card { padding: 3rem; }
          .compare-card.bad { border-top: 4px solid #EF4444; }
          .compare-card.good { border-top: 4px solid var(--secondary); }
          .compare-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.5rem; }
          .compare-list li { display: flex; align-items: flex-start; gap: 1rem; font-size: 1.1rem; }
          .icon-bad { color: #EF4444; font-size: 1.25rem; font-weight: bold; }
          .icon-good { color: var(--secondary); font-size: 1.25rem; font-weight: bold; }

          /* Pricing */
          .pricing-grid {
             display: grid;
             grid-template-columns: 1fr 1fr;
             gap: 2rem;
             max-width: 900px;
             margin: 0 auto;
          }
          .price-card { padding: 3rem; position: relative; }
          .price-card.popular {
             border-color: var(--primary);
             box-shadow: 0 0 40px rgba(99, 102, 241, 0.2);
          }
          .popular-badge {
             position: absolute; top: -1rem; left: 50%; transform: translateX(-50%);
             background: linear-gradient(135deg, var(--primary), #818CF8);
             padding: 0.5rem 1.5rem; border-radius: 2rem; font-size: 0.875rem; font-weight: bold;
             box-shadow: 0 5px 15px var(--primary-glow);
          }
          .price { font-size: 4rem; font-weight: 800; margin: 1rem 0; color: white; display: flex; align-items: baseline; gap: 0.5rem; }
          .price span { font-size: 1.25rem; color: var(--text-muted); font-weight: 500; }
          
          /* FAQ */
          .faq-container { max-width: 800px; margin: 0 auto; }
          .faq-item {
             background: var(--surface); border: 1px solid var(--border);
             border-radius: 1rem; margin-bottom: 1rem; overflow: hidden;
          }
          .faq-question {
             width: 100%; text-align: left; padding: 1.5rem 2rem;
             background: none; border: none; color: white;
             font-size: 1.125rem; font-weight: 600; cursor: pointer;
             display: flex; justify-content: space-between; align-items: center;
          }
          .faq-answer {
             max-height: 0px; overflow: hidden; transition: max-height 0.3s ease;
             padding: 0 2rem; color: var(--text-muted); line-height: 1.6;
          }
          .accordion-icon { font-size: 1.5rem; transition: transform 0.3s ease; color: var(--primary); }

          /* Feedback Form */
          .feedback-grid {
             display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;
          }
          .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
          .form-group label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
          .form-input {
             background: rgba(0,0,0,0.3); border: 1px solid var(--border);
             padding: 1rem 1.25rem; border-radius: 0.75rem;
             color: white; font-family: inherit; font-size: 1rem;
             transition: border-color 0.2s; outline: none;
          }
          .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
          
          /* Animations */
          .animate-on-scroll {
             opacity: 0;
             transform: translateY(30px);
             transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .animate-on-scroll.in-view {
             opacity: 1;
             transform: translateY(0);
          }
          .delay-1 { transition-delay: 0.1s; }
          .delay-2 { transition-delay: 0.2s; }
          
          /* Responsive */
          @media (max-width: 992px) {
             .hero-grid { grid-template-columns: 1fr; text-align: center; }
             .hero-actions { justify-content: center; }
             .hero-social { justify-content: center; }
             .how-it-works-grid { grid-template-columns: 1fr; }
             .compare-grid { grid-template-columns: 1fr; }
             .pricing-grid { grid-template-columns: 1fr; }
             .feedback-grid { grid-template-columns: 1fr; }
          }
          @media (max-width: 768px) {
             .nav-links { display: none; }
             .mobile-menu-btn { display: block; }
             .hero-title { font-size: 2.5rem; }
             .section-title { font-size: 2rem; }
             .btn-primary, .btn-secondary { width: 100%; }
             .nav-auth .btn-primary { display: none; }
          }
        `}
      </style>

      {/* Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M20 4L24 18L38 20L24 22L20 36L16 22L2 20L16 18L20 4Z" fill="url(#logo-grad)" />
              <defs>
                <linearGradient id="logo-grad" x1="2" y1="4" x2="38" y2="36">
                  <stop offset="0%" stopColor="#6366F1"/>
                  <stop offset="100%" stopColor="#14B8A6"/>
                </linearGradient>
              </defs>
            </svg>
            PrepAI
          </Link>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-auth">
            <Link to="/login" className="nav-links" style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem', borderRadius: '0.75rem' }}>Get Started</Link>
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content animate-on-scroll">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              AI-Powered Interview Coach
            </div>
            <h1 className="hero-title">
               Crack every <br/> interview. <br/>
               <span className="text-gradient-primary">Powered by AI.</span>
            </h1>
            <p className="hero-subtitle">
               Practice coding algorithms, system design MCQs, and behavioral mock interviews with real-time AI feedback. Land the job you deserve.
            </p>
            <div className="hero-actions">
               <Link to="/register" className="btn-primary">⚡ Start Free Trial</Link>
               <a href="#how-it-works" className="btn-secondary">▶ View Demo</a>
            </div>
            <div className="hero-social">
               <div className="avatars">
                 <div className="avatar" style={{ background: '#6366F1' }}>AK</div>
                 <div className="avatar" style={{ background: '#14B8A6' }}>SR</div>
                 <div className="avatar" style={{ background: '#F59E0B' }}>MJ</div>
                 <div className="avatar" style={{ background: '#EF4444' }}>PK</div>
               </div>
               <div>
                 <div style={{ color: '#F59E0B', fontSize: '1.2rem', letterSpacing: '2px', lineHeight: 1 }}>★★★★★</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Joined by <strong style={{ color: 'white' }}>{userCount || '10k+'}</strong> developers</div>
               </div>
            </div>
          </div>
          
          <div className="hero-visual animate-on-scroll delay-1">
             <div className="mockup-card">
                <div className="mockup-header">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤖</div>
                      <div>
                         <div style={{ fontWeight: 'bold' }}>Senior Frontend Interview</div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mock AI Interviewer</div>
                      </div>
                   </div>
                   <div style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="pulse-dot"></span> Live
                   </div>
                </div>
                
                <div className="mock-chat-bubble bubble-ai">
                   Tell me about a time you optimized a deeply nested React component structure.
                </div>
                <div className="mock-chat-bubble bubble-user">
                   In my last role, we had a dashboard causing unnecessary re-renders. I implemented React.memo and created specialized context providers...
                </div>
                <div className="mock-chat-bubble bubble-ai" style={{ borderLeft: '4px solid var(--secondary)' }}>
                   Excellent answer using the STAR method. Let's move on to a coding challenge regarding state normalization.
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding" style={{ background: 'rgba(15, 15, 30, 0.3)' }}>
        <div className="container">
           <div className="section-header animate-on-scroll">
              <h2 className="section-title">How <span className="text-gradient">PrepAI</span> works</h2>
              <p className="section-subtitle">Go from zero to interview-ready in three seamless steps.</p>
           </div>
           
           <div className="how-it-works-grid">
              <div className="glass-card step-card animate-on-scroll step-1">
                 <div className="step-number">01</div>
                 <div className="step-icon">&lt;/&gt;</div>
                 <h3>Practice Coding</h3>
                 <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Solve real DSA problems on our built-in editor. Filter by difficulty, topic, and company tag. Pass all test cases.</p>
              </div>
              <div className="glass-card step-card animate-on-scroll delay-1 step-2">
                 <div className="step-number">02</div>
                 <div className="step-icon">☑️</div>
                 <h3>Test with MCQs</h3>
                 <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Quiz yourself on OS, DBMS, Networking, and System Design. Get instant explanations for every wrong answer.</p>
              </div>
              <div className="glass-card step-card animate-on-scroll delay-2 step-3">
                 <div className="step-number">03</div>
                 <div className="step-icon">💬</div>
                 <h3>AI Mock Interview</h3>
                 <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Chat with our AI interviewer. Get scored on your technical accuracy and communication skills instantly.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section id="features" className="section-padding">
         <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Why choose <span className="text-gradient-primary">PrepAI?</span></h2>
              <p className="section-subtitle">Stop guessing what the interviewers want.</p>
           </div>
           
           <div className="compare-grid">
              <div className="glass-card compare-card bad animate-on-scroll">
                 <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="icon-bad">✕</span> Without PrepAI
                 </h3>
                 <ul className="compare-list">
                    <li><span className="icon-bad">✕</span> <span style={{ color: 'var(--text-muted)' }}>Guessing which topics to study</span></li>
                    <li><span className="icon-bad">✕</span> <span style={{ color: 'var(--text-muted)' }}>Blanking out mid-interview due to nerves</span></li>
                    <li><span className="icon-bad">✕</span> <span style={{ color: 'var(--text-muted)' }}>No feedback on your structural answers</span></li>
                    <li><span className="icon-bad">✕</span> <span style={{ color: 'var(--text-muted)' }}>Getting rejected without knowing why</span></li>
                 </ul>
              </div>
              <div className="glass-card compare-card good animate-on-scroll delay-1" style={{ background: 'rgba(20, 184, 166, 0.05)' }}>
                 <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                    <span className="icon-good">✓</span> With PrepAI
                 </h3>
                 <ul className="compare-list">
                    <li><span className="icon-good">✓</span> <span>Targeted practice based on specific job roles</span></li>
                    <li><span className="icon-good">✓</span> <span>Confident, structured answers via the STAR method</span></li>
                    <li><span className="icon-good">✓</span> <span>Instant AI intelligence grading every response</span></li>
                    <li><span className="icon-good">✓</span> <span>Track progress and visualize improvement daily</span></li>
                 </ul>
              </div>
           </div>
         </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding" style={{ background: 'rgba(15, 15, 30, 0.3)' }}>
         <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Simple, honest pricing.</h2>
              <p className="section-subtitle">Start free. Upgrade when you're ready to secure the bag.</p>
           </div>
           
           <div className="pricing-grid">
              <div className="glass-card price-card animate-on-scroll">
                 <h3 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Community plan</h3>
                 <div className="price">₹0 <span>/forever</span></div>
                 <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Perfect for casual preparation and beginners.</p>
                 
                 <ul className="compare-list" style={{ gap: '1rem', marginBottom: '2.5rem' }}>
                    <li><span style={{ color: 'var(--text-muted)' }}>✓</span> <span>5 coding questions / day</span></li>
                    <li><span style={{ color: 'var(--text-muted)' }}>✓</span> <span>20 MCQs / day</span></li>
                    <li><span style={{ color: 'var(--text-muted)' }}>✓</span> <span>3 AI mock interviews / month</span></li>
                    <li><span style={{ color: 'var(--text-muted)' }}>✓</span> <span>Basic dashboard tracking</span></li>
                 </ul>
                 
                 <Link to="/register" className="btn-secondary" style={{ width: '100%' }}>Create Free Account</Link>
              </div>
              
              <div className="glass-card price-card popular animate-on-scroll delay-1" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                 <div className="popular-badge">Most Popular</div>
                 <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Pro Plan</h3>
                 <div className="price text-gradient-primary">₹299 <span>/month</span></div>
                 <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>For serious individuals ready to land their dream job.</p>
                 
                 <ul className="compare-list" style={{ gap: '1rem', marginBottom: '2.5rem' }}>
                    <li><span style={{ color: 'var(--primary)' }}>✓</span> <strong>Unlimited</strong> coding questions</li>
                    <li><span style={{ color: 'var(--primary)' }}>✓</span> <strong>Unlimited</strong> MCQ practice</li>
                    <li><span style={{ color: 'var(--primary)' }}>✓</span> <strong>Unlimited</strong> AI mock interviews</li>
                    <li><span style={{ color: 'var(--primary)' }}>✓</span> <strong>Advanced</strong> analytics & insights</li>
                 </ul>
                 
                 <Link to="/register" className="btn-primary" style={{ width: '100%' }}>Get Started — It's Free</Link>
                 <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>Sign up free, then upgrade to Pro anytime.</p>
              </div>
           </div>
         </div>
      </section>

      {/* FAQ & Feedback */}
      <section id="faq" className="section-padding">
         <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Got questions?</h2>
              <p className="section-subtitle">We have answers.</p>
           </div>
           
           <div className="faq-container animate-on-scroll">
              <div className="faq-item">
                 <button className="faq-question" onClick={toggleAccordion}>
                    Is PrepAI really free to use?
                    <span className="accordion-icon">+</span>
                 </button>
                 <div className="faq-answer">
                    <p style={{ paddingBottom: '1.5rem' }}>Yes! Our community plan gives you access to a daily limit of coding questions, MCQs, and access to 3 full mock interviews per month. No credit card is required to sign up.</p>
                 </div>
              </div>
              <div className="faq-item">
                 <button className="faq-question" onClick={toggleAccordion}>
                    How does the AI mock interview work?
                    <span className="accordion-icon">+</span>
                 </button>
                 <div className="faq-answer">
                    <p style={{ paddingBottom: '1.5rem' }}>You configure your target role and difficulty. Our specialized AI interviewer generates contextual behavioral and technical questions, listens to your input using the STAR method, and provides an immediate evaluation and score.</p>
                 </div>
              </div>
              <div className="faq-item">
                 <button className="faq-question" onClick={toggleAccordion}>
                    Can I cancel my Pro subscription?
                    <span className="accordion-icon">+</span>
                 </button>
                 <div className="faq-answer">
                    <p style={{ paddingBottom: '1.5rem' }}>Absolutely. You can manage your subscription easily from the dashboard. If you cancel, you will drop back to the Free plan at the end of your billing cycle.</p>
                 </div>
              </div>
           </div>
           
           {/* Feedback Form */}
           <div className="glass-card animate-on-scroll" style={{ maxWidth: 800, margin: '6rem auto 0', padding: '3rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                 <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>We'd love to hear from you</h2>
                 <p style={{ color: 'var(--text-muted)' }}>Help us improve PrepAI with your honest feedback, feature requests, or bug reports.</p>
              </div>
              <form onSubmit={handleFeedbackSubmit}>
                 <div className="feedback-grid">
                    <div className="form-group">
                       <label>Full Name</label>
                       <input className="form-input" type="text" placeholder="John Doe" required value={feedback.name} onChange={e => setFeedback({...feedback, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                       <label>Email Address</label>
                       <input className="form-input" type="email" placeholder="john@example.com" required value={feedback.email} onChange={e => setFeedback({...feedback, email: e.target.value})} />
                    </div>
                 </div>
                 <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label>Your Message</label>
                    <textarea className="form-input" rows="4" placeholder="Tell us what you liked or how we can improve..." style={{ resize: 'vertical' }} required value={feedback.message} onChange={e => setFeedback({...feedback, message: e.target.value})}></textarea>
                 </div>
                 <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={feedbackLoading}>
                    {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                 </button>
              </form>
           </div>
         </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="section-padding" style={{ textAlign: 'center', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.5)' }}>
         <div className="container animate-on-scroll">
            <h2 className="section-title">Ready to ace your next interview?</h2>
            <p className="section-subtitle" style={{ marginBottom: '3rem' }}>Start practicing today. It's free, intuitive, and extremely effective.</p>
            <Link to="/register" className="btn-primary" style={{ background: 'white', color: 'black', boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>
               Create Free Account Now
            </Link>
            <div style={{ marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
               &copy; {new Date().getFullYear()} PrepAI. All rights reserved. Built with ❤️ for developers.
            </div>
         </div>
      </footer>

    </div>
  );
};

export default Landing;
