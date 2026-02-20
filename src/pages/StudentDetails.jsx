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
          
          {/* Progress / Time Tracker Widget */}
          <div className="card widget-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="widget-title" style={{ margin: 0 }}>Time tracker</h3>
              <span style={{ fontSize: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>↗</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
               <div className="circular-progress yellow" style={{ 
                 width: '120px', height: '120px', 
                 background: `conic-gradient(var(--warning-color) ${Math.min(100, stats.attendance + 10)}%, rgba(255,255,255,0.05) 0deg)`,
                 marginBottom: '1rem',
                 position: 'relative'
               }}>
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '50%', width: '90px', height: '90px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>02:35</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Work Time</span>
                 </div>
               </div>
               <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                 <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>▶</button>
                 <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>⏸</button>
               </div>
            </div>
          </div>

          {/* Onboarding Task Widget */}
          <div className="card widget-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="widget-title" style={{ margin: 0 }}>Onboarding Task</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: 300 }}>{Math.max(1, (parseInt(id) || 1) % 5)}/8</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                 <div style={{ minWidth: '32px', height: '32px', backgroundColor: 'var(--app-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                 </div>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: 0, fontSize: '0.9rem' }}>Interview</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sep 12, 08:30</p>
                 </div>
                 <div style={{ color: 'var(--warning-color)', fontSize: '1.2rem' }}>✓</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                 <div style={{ minWidth: '32px', height: '32px', backgroundColor: 'var(--app-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                 </div>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: 0, fontSize: '0.9rem' }}>Team Meeting</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sep 13, 10:30</p>
                 </div>
                 <div style={{ color: 'var(--warning-color)', fontSize: '1.2rem' }}>✓</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', opacity: 0.6 }}>
                 <div style={{ minWidth: '32px', height: '32px', backgroundColor: 'var(--app-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                 </div>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: 0, fontSize: '0.9rem' }}>Project Update</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sep 13, 15:00</p>
                 </div>
                 <div style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>○</div>
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
          
          {/* Task Calendar Component based on Screenshot 3 bottom left */}
          <div className="card widget-card col-span-full" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>August</span>
               <h3 className="widget-title" style={{ margin: 0 }}>September 2024</h3>
               <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>October</span>
            </div>
            
            <div style={{ display: 'flex', position: 'relative', marginTop: '1rem', paddingBottom: '0.5rem' }}>
               {/* Timeline ticks */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '60px', color: 'var(--text-secondary)', fontSize: '0.75rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '0.5rem', textAlign: 'right' }}>
                 <span>8:00 am</span>
                 <span>9:00 am</span>
                 <span>10:00 am</span>
                 <span>11:00 am</span>
               </div>
               
               {/* Timeline content */}
               <div style={{ flex: 1, paddingLeft: '1rem', position: 'relative' }}>
                 <div style={{ position: 'absolute', top: '20px', left: '1rem', right: 0, backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-color)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500 }}>Weekly Team Sync</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Discuss progress on projects</p>
                 </div>
                 
                 <div style={{ position: 'absolute', top: '90px', left: '50%', right: 0, backgroundColor: 'var(--card-bg-darker)', padding: '0.75rem', borderRadius: '12px', borderLeft: '4px solid var(--warning-color)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500 }}>Onboarding Session</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Introduction for new hires</p>
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
