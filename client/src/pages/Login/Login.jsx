import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Common/Logo';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, user } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await signup(name, email, password);
      if (res.success) {
        setIsLogin(true); // Switch to login after successful signup
        setErrorMsg('Account created successfully. Please login.');
        setPassword('');
      }
    }

    if (!res.success) {
      setErrorMsg(res.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      {/* Left Panel - Illustration and branding */}
      <div className="login-left-panel">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2"></div>
        <div className="glow-blob blob-3"></div>

        {/* Brand Header Logo */}
        <a href="/" className="brand-header" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <Logo width={180} />
        </a>

        {/* Middle Content - Dynamic SVG Network Grid */}
        <div className="illustration-container">
          <div className="network-canvas">
            {/* SVG Network Lines */}
            <svg className="network-lines-svg">
              {/* Top Node to Middle-Left and Middle-Right */}
              <line x1="260" y1="80" x2="140" y2="230" className="network-line" />
              <line x1="260" y1="80" x2="385" y2="190" className="network-line" />
              
              {/* Middle-Left to Bottom-Left and Center-Bottom */}
              <line x1="140" y1="230" x2="130" y2="270" className="network-line" />
              <line x1="140" y1="230" x2="265" y2="240" className="network-line" />
              
              {/* Middle-Right to Bottom-Right */}
              <line x1="385" y1="190" x2="435" y2="280" className="network-line" />
              <line x1="265" y1="240" x2="435" y2="280" className="network-line" />

              {/* Glowing animated path overlays */}
              <path d="M260 80 L140 230" className="network-line-glow" />
              <path d="M140 230 L265 240" className="network-line-glow" />
              <path d="M260 80 L385 190" className="network-line-glow" />
              <path d="M265 240 L435 280" className="network-line-glow" />
            </svg>

            {/* Laptop Node */}
            <div className="node-box node-laptop" title="Laptops">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="2" y1="20" x2="22" y2="20" />
                <line x1="12" y1="17" x2="12" y2="20" />
              </svg>
            </div>
            
            {/* Chair Node */}
            <div className="node-box node-chair" title="Office Furniture">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 18V21M17 18V21M6 10V18H18V10C18 7.79086 16.2091 6 14 6H10C7.79086 6 6 7.79086 6 10Z" />
                <path d="M3 13H21" />
                <path d="M12 2V6" />
                <path d="M8 10H16" />
              </svg>
            </div>

            {/* Car Node */}
            <div className="node-box node-car" title="Vehicles">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.3 2 11.7 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>

            {/* Printer Node */}
            <div className="node-box node-printer" title="Printers">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </div>

            {/* Screen Node */}
            <div className="node-box node-screen" title="Meeting Rooms">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="12" rx="2" />
                <path d="M9 21h6" />
                <path d="M12 15v6" />
                <path d="M12 9v2" />
                <path d="M8 9h8" />
              </svg>
            </div>
          </div>

          {/* Floating Analytics Cards */}
          {/* Card 1: Assets */}
          <div className="floating-card card-assets">
            <div className="card-icon-wrapper bg-blue-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="card-info">
              <span className="card-label">Assets</span>
              <span className="card-value">1,420</span>
              <span className="card-trend">↑ 12% this wk</span>
            </div>
          </div>

          {/* Card 2: Maintenance */}
          <div className="floating-card card-maintenance">
            <div className="card-icon-wrapper bg-amber-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div className="card-info">
              <span className="card-label">Maintenance</span>
              <span className="card-value">7 Today</span>
              <span className="card-trend" style={{ color: '#f43f5e' }}>● 2 Urgent</span>
            </div>
          </div>

          {/* Card 3: Bookings */}
          <div className="floating-card card-bookings">
            <div className="card-icon-wrapper bg-cyan-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="card-info">
              <span className="card-label">Bookings</span>
              <span className="card-value">13 Active</span>
              <span className="card-trend">3 Upcoming</span>
            </div>
          </div>

          {/* Card 4: Departments */}
          <div className="floating-card card-departments">
            <div className="card-icon-wrapper bg-purple-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="card-info">
              <span className="card-label">Departments</span>
              <span className="card-value">6 Active</span>
              <span className="card-trend">Across 3 Hubs</span>
            </div>
          </div>
        </div>

        {/* Brand Headline & Subtitle */}
        <div className="panel-footer-headline">
          <h1 className="panel-headline">
            Enterprise Asset &<br />
            Resource Management
          </h1>
          <p className="panel-subtitle">
            Track assets. Allocate smarter. Manage efficiently.
          </p>
        </div>
      </div>

      {/* Right Panel - Sign In UI */}
      <div className="login-right-panel">
        <div className="auth-glowing-blob"></div>

        <div className="login-auth-card">
          <div className="auth-header">
            <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {isLogin ? 'Sign in to continue to AssetFlow' : 'Register as a new employee'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className={`auth-error ${errorMsg.includes('successfully') ? 'auth-success' : ''}`} style={{ color: errorMsg.includes('successfully') ? '#10b981' : '#f43f5e', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}
            
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="name"
                    type="text"
                    className="input-field"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="rahul@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field password-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="form-actions">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="custom-checkbox">
                    <svg className="check-icon" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  Remember me
                </label>
                <a href="#forgot" className="forgot-password">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>


          </form>

          <div className="auth-footer">
            {isLogin ? (
              <>
                New employee?
                <button type="button" onClick={() => { setIsLogin(false); setErrorMsg(''); }} className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Create Employee Account
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button type="button" onClick={() => { setIsLogin(true); setErrorMsg(''); }} className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Sign In instead
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
