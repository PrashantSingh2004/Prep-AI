import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import LoadingAnimation from './components/LoadingAnimation';
import ProfilePanel from './components/ProfilePanel';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Lazy load route components for performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuestionsList = lazy(() => import('./pages/QuestionsList'));
const QuestionDetail = lazy(() => import('./pages/QuestionDetail'));
const MCQHome = lazy(() => import('./pages/MCQHome'));
const MCQQuiz = lazy(() => import('./pages/MCQQuiz'));
const MCQResult = lazy(() => import('./pages/MCQResult'));
const InterviewSetup = lazy(() => import('./pages/InterviewSetup'));
const InterviewChat = lazy(() => import('./pages/InterviewChat'));
const Pricing = lazy(() => import('./pages/Pricing')); // Import Pricing
const Payment = lazy(() => import('./pages/Payment'));
const Landing = lazy(() => import('./pages/Landing'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Inner component to handle AnimatePresence logic properly with useLocation hook
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingAnimation />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes inside MainLayout */}
          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/questions" element={<QuestionsList />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            
            <Route path="/mcq" element={<MCQHome />} />
            <Route path="/mcq/quiz/:topicId" element={<MCQQuiz />} />
            <Route path="/mcq/results" element={<MCQResult />} />
            
            <Route path="/interview" element={<InterviewSetup />} />
            <Route path="/interview/setup" element={<InterviewSetup />} />
            <Route path="/interview/session/:sessionId" element={<InterviewChat />} />

            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster 
              position="top-right" 
              toastOptions={{ 
                duration: 3000,
                className: 'themed-toast', 
                style: { 
                  background: 'var(--bg-surface)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                },
                success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
                error: { iconTheme: { primary: 'var(--color-danger)', secondary: '#fff' } },
              }} 
            />
            <ProfilePanel />
            <AnimatedRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
