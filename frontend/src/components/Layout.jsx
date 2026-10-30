import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      <Sidebar />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden'}}>
        <header style={{
          display: 'flex', 
          justifyContent: 'flex-end', 
          padding: '1rem 2rem', 
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <button className="btn btn-outline" onClick={logout} style={{padding: '0.5rem 1rem'}}>
            <LogOut size={16} /> Logout
          </button>
        </header>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
