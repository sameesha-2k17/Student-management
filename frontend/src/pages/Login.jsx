import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Incorrect username or password.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-background)',
      padding: 'var(--space-md)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-xl">
          <h1 className="text-h2 text-primary mb-sm">Welcome Back</h1>
          <p className="text-muted">Sign in to mark attendance</p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            padding: 'var(--space-sm) var(--space-md)',
            borderRadius: 'var(--border-radius-md)',
            marginBottom: 'var(--space-md)',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email / Username</label>
            <input 
              type="text" 
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
              autoFocus
            />
          </div>
          
          <div className="form-group mb-xl">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block btn-large" disabled={isLoading}>
            {isLoading ? 'SIGNING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
