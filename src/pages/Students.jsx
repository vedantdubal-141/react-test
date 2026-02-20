import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Students() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('API failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        // Get 6 from API
        const apiUsers = data.slice(0, 6).map(u => ({ ...u, isApiUser: true }));
        
        // Get local students
        let localUsers = [];
        const saved = localStorage.getItem('students');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              localUsers = parsed;
            }
          } catch (e) {
            console.error("Local storage error:", e);
          }
        }
        
        // Merge them
        setUsers([...localUsers, ...apiUsers]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Student Directory</h1>
        <p style={{ color: 'var(--text-secondary)' }}>All registered students</p>
      </header>

      {loading && <p className="loading-text">Loading...</p>}
      
      {error && <p className="error-text text-error">Error: {error}</p>}
      
      {!loading && !error && (
        <div className="users-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {users.map(user => (
            <Link to={`/student/${user.id}`} key={user.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card user-card" style={{ cursor: 'pointer', transition: 'transform 0.2sease, box-shadow 0.2sease' }}>
                <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{user.name}</h3>
                    {user.isApiUser && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mock API Data</span>}
                  </div>
                </div>
                <div className="card-body">
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span className="icon">📧</span> {user.email}
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span className="icon">📞</span> {user.phone}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;
