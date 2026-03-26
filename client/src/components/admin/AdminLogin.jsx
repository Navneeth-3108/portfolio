import React, { useState } from 'react';
import { apiService } from '../../services/api';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Access Denied: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.9rem 1.2rem',
    borderRadius: '16px',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '1rem',
    marginBottom: '1.25rem'
  };

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '440px', 
        width: '100%', 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(20px)',
        padding: '3rem', 
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            borderRadius: '18px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 24px rgba(59, 130, 246, 0.4)',
            color: 'white'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Admin Access</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Portfolio Management</p>
        </div>



        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Access Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{ 
              padding: '1rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: '12px', 
              color: '#f87171', 
              fontSize: '0.85rem', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
              border: 'none', 
              borderRadius: '16px', 
              color: 'white', 
              fontWeight: '700', 
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Authorizing...' : 'Initialize Access'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        input:focus {
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 20px -5px rgba(59, 130, 246, 0.4);
        }
        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
