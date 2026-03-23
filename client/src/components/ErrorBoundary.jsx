import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: 'var(--color-danger)', fontSize: '2.5rem', marginBottom: '16px' }}>Oops! Something went wrong.</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px' }}>
            A critical rendering error occurred in this view. Please try refreshing the page or returning to the dashboard.
          </p>
          <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'left', maxWidth: '800px', width: '100%', overflowX: 'auto', marginBottom: '32px' }}>
             <pre style={{ margin: 0, color: 'var(--color-danger-text)', fontSize: '0.85rem' }}>
               {this.state.error && this.state.error.toString()}
             </pre>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>
            Return to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
