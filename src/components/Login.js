import './Login.css';

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, register, loginWithGoogle } = useAuth(); // include Google login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Keep for potential future use or if you toggle login/register
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      // Since the current UI is designed primarily for login, we'll default to login.
      // If you implement a toggle for register, this logic will become relevant again.
      if (isRegister) { // This part is currently not exposed in the UI
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/tracker');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login.');
      console.error("Login error:", err); // Log the full error for debugging
    }
  };

  const handleGoogleLogin = async () => {
    setError(''); // Clear previous errors
    try {
      await loginWithGoogle();
      navigate('/tracker');
    } catch (err) {
      setError(err.message || 'Failed to log in with Google.');
      console.error("Google login error:", err); // Log the full error for debugging
    }
  };

  return (
    <div className="login-page-container"> {/* Updated container class */}
      {/* Background abstract shapes/decorations */}
      {/* Using an img tag for the abstract shape, ensure path is correct */}
      <img src="/abstract-shape.svg" alt="Abstract background shape" className="abstract-shape top-left" />
      <img src="/abstract-shape.svg" alt="Abstract background shape" className="abstract-shape bottom-right" />


      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p> {/* Added a subtitle */}
        </div>

        {error && <p className="error-message">{error}</p>} {/* Error message with new class */}

        <div className="input-group">
          <label htmlFor="email">Email</label> {/* Added htmlFor for accessibility */}
          <input
            id="email" // Added id for htmlFor
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label> {/* Added htmlFor for accessibility */}
          <input
            id="password" // Added id for htmlFor
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password" 
          />
        </div>

        {/* Removed the isRegister toggle and forgot password link as per your commented out section,
            assuming the current design focuses on a single login screen. */}
        {/* If you want "Sign Up" or "Forgot Password" links, they would be handled here. */}

        <div className="action-area"> {/* Group login specific actions */}
          <button type="submit" className="login-button"> {/* Primary login button */}
            Sign In {/* Text for the main login button */}
          </button>

          {/* <div className="separator">
            <span>OR</span>
          </div>

          <button type="button" className="btn-google" onClick={handleGoogleLogin}>
            <img src="/google-icon.svg" alt="Google logo" className="google-icon" />
            Continue with Google
          </button> */}
        </div>

        {/* Optional: Add a link for "Don't have an account?" at the bottom if registration is separate */}
        {/* <p className="create-account-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Sign Up</span>
        </p> */}

      </form>
    </div>
  );
};

export default Login;