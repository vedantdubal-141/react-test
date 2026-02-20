import { NavLink } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import './Sidebar.css';

function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Smartech</h2>
          <button 
            onClick={toggleTheme} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-primary)' }}
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <div className="user-profile">
          <div className="avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin Portal</span>
            <span className="user-role">Dashboard</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <span className="icon">🏠</span> Dashboard
        </NavLink>
        
        <NavLink 
          to="/students" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <span className="icon">👥</span> Students
        </NavLink>
        
        <NavLink 
          to="/add" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <span className="icon">➕</span> Add Student
        </NavLink>
        
        <NavLink 
          to="/counter" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <span className="icon">⏱️</span> Counter
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn">
          <span className="icon">🚪</span> Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
