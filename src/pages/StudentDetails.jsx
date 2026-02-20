import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Time-based greeting
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    // Determine if it's an API user (ids 1-10) or local user (timestamp id)
    if (id < 100) {
      // Fetch from API
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(res => res.json())
        .then(data => {
          setStudent({ ...data, isApiUser: true });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      // Fetch from local storage
      const saved = localStorage.getItem('students');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const localStudent = parsed.find(s => s.id.toString() === id);
          if (localStudent) {
            setStudent({ ...localStudent, isApiUser: false });
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
  }, [id]);

  // Generate deterministic stats for API users, or use zero-state for local ones.
  const stats = useMemo(() => {
    if (!student) return null;
    
    // Local student with zero-state initialized
    if (!student.isApiUser && student.stats) {
      return student.stats; 
    }
    
    // API student - generate deterministic stats based on ID to make them look distinct
    const seed = parseInt(id) || 1;
    return {
      attendance: Math.min(100, 50 + (seed * 5)),
      homework: Math.min(100, 60 + (seed * 3)),
      rating: Math.min(100, 40 + (seed * 8)),
      activity: [
        (seed * 2) % 10, 
        (seed * 5) % 15, 
        (seed * 3) % 12, 
        (seed * 7) % 20, 
        (seed * 4) % 18, 
        (seed * 6) % 15, 
        (seed * 1) % 8
      ],
      budget: [
        (seed * 20),
        (seed * 30),
        (seed * 10),
        (seed * 50),
        (seed * 40),
        (seed * 15),
        (seed * 5)
      ]
    };
  }, [student, id]);

  if (loading) return <div className="page-container"><p>Loading student data...</p></div>;
  if (!student) return <div className="page-container"><p>Student not found.</p><button className="btn" onClick={() => navigate('/students')}>Back to Directory</button></div>;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = days.map((day, i) => ({
    name: day,
    Tasks: stats.activity[i]
  }));

  const budgetData = days.map((day, i) => ({
    name: day,
    Spend: stats.budget ? stats.budget[i] : (stats.activity[i] * 5) // Fallback for local students without budget map
  }));

  return (
    <div className="dashboard-layout">
      {/* Left Main Content */}
      <div className="dashboard-main">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button onClick={() => navigate('/students')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>&larr;</span> Back to Directory
            </button>
            <h1>{greeting}, {student.name.split(' ')[0]}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Check daily tasks & schedules</p>
          </div>
          
          {/* Avatar greeting widget (Replaces GIF) */}
          <div className="greeting-avatar" style={{ backgroundColor: 'var(--card-bg)', padding: '1rem 2rem', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)'}}>
            <div style={{ fontSize: '2.5rem' }}>👋</div>
            <div>
              <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>Welcome to</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Admin Portal</p>
            </div>
          </div>
        </header>
        
        <div className="dashboard-grid">
          
          {/* Projects & Meetings Widgets replacing Added students */}
          <div className="card widget-card" style={{ padding: '1.25rem' }}>
            <h3 className="widget-title" style={{ marginBottom: '1rem' }}>Active Projects</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
               <div className="sm-avatar" style={{ minWidth: '40px', height: '40px', backgroundColor: 'var(--success-color)', color: 'white' }}>🚀</div>
               <div>
                 <p style={{ margin: 0, fontWeight: 500 }}>React Exam Demo</p>
                 <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Due in 2 days</p>
               </div>
            </div>
          </div>

          <div className="card widget-card" style={{ padding: '1.25rem' }}>
            <h3 className="widget-title" style={{ marginBottom: '1rem' }}>Upcoming Meetings</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
               <div className="sm-avatar" style={{ minWidth: '40px', height: '40px', backgroundColor: 'var(--warning-color)', color: 'white' }}>📅</div>
               <div>
                 <p style={{ margin: 0, fontWeight: 500 }}>1:1 Sync</p>
                 <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>10:00 AM</p>
               </div>
            </div>
          </div>

          {/* Activity Area Chart */}
          <div className="card widget-card col-span-full" style={{ padding: '1.5rem', height: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="widget-title" style={{ margin: 0 }}>Activity</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', backgroundColor: 'var(--accent-link-bg)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                {stats.activity.reduce((a, b) => a + b, 0)} Tasks
              </span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasksDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg-darker)', borderRadius: '8px', border: 'none', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--accent-color)' }}
                />
                <Area type="monotone" dataKey="Tasks" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorTasksDetail)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Task Calendar Component based on example.jpg left-bottom */}
          <div className="card widget-card col-span-full">
            <h3 className="widget-title">Task Checklist & Contact</h3>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem'}}><strong>Email:</strong> {student.email}</p>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem'}}><strong>Phone:</strong> {student.phone}</p>
                {student.website && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem'}}><strong>Website:</strong> {student.website}</p>}
                {student.gender && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem'}}><strong>Gender:</strong> {student.gender}</p>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Update Profile Details</span>
                  <span>✓</span>
                </div>
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{color: 'var(--text-secondary)'}}>Submit Assignment #4</span>
                  <span style={{color: 'var(--text-secondary)'}}>O</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Sidebar Stats */}
      <div className="dashboard-sidebar-right">
        <div className="card stats-card-right" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
             <div className="avatar" style={{ width: '80px', height: '80px', margin: '0 auto 1rem', fontSize: '2rem' }}>
                {student.name.charAt(0)}
             </div>
             <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: 500 }}>{student.name}</h3>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', border: '1px solid var(--text-secondary)', borderRadius: '12px' }}>
                {student.isApiUser ? 'External Learner' : 'Internal Learner'}
             </span>
          </div>

          <div className="stat-item">
            <span className="stat-title" style={{ color: 'var(--text-primary)'}}>Attendance</span>
            <div className="circular-progress pink" style={{ background: `conic-gradient(var(--accent-color) ${stats.attendance}%, rgba(255,255,255,0.1) 0deg)`}}>
              <span className="progress-value">{stats.attendance}%</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-title" style={{ color: 'var(--text-primary)'}}>Homework</span>
            <div className="circular-progress teal" style={{ background: `conic-gradient(var(--success-color) ${stats.homework}%, rgba(255,255,255,0.1) 0deg)`}}>
              <span className="progress-value">{stats.homework}%</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-title" style={{ color: 'var(--text-primary)'}}>Rating</span>
            <div className="circular-progress yellow" style={{ background: `conic-gradient(var(--warning-color) ${stats.rating}%, rgba(255,255,255,0.1) 0deg)`}}>
              <span className="progress-value">{stats.rating}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
