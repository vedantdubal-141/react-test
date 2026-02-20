import { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import './Home.css';

function Home() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // On page load, read students from localStorage
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        if (Array.isArray(parsed)) {
          setStudents(parsed);
        }
      } catch (e) {
        console.error("Error reading localStorage", e);
      }
    }
  }, []);

  // Calculate aggregated stats across all local students to handle the "Zero state" correctly
  const aggregatedStats = useMemo(() => {
    const defaultStats = {
      attendance: 0,
      homework: 0,
      rating: 0,
      activity: [0, 0, 0, 0, 0, 0, 0], // Mon-Sun
      budget: [0, 0, 0, 0, 0, 0, 0], // Made up budget based on example2.png
    };

    if (students.length === 0) return defaultStats;

    const totals = { ...defaultStats, activity: [...defaultStats.activity], budget: [...defaultStats.budget] };
    
    students.forEach(student => {
      const s = student.stats || defaultStats;
      totals.attendance += s.attendance || 0;
      totals.homework += s.homework || 0;
      totals.rating += s.rating || 0;
      
      const act = s.activity || defaultStats.activity;
      act.forEach((val, i) => totals.activity[i] += val);
      
      // We'll simulate a budget map just to populate the Bar chart if stats exist
      totals.budget.forEach((_, i) => totals.budget[i] += ((s.attendance || 0) * 0.5)); 
    });

    // Average out the percentage rings
    totals.attendance = Math.round(totals.attendance / students.length);
    totals.homework = Math.round(totals.homework / students.length);
    totals.rating = Math.round(totals.rating / students.length);

    return totals;
  }, [students]);

  // Activity Chart Data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = days.map((day, i) => ({
    name: day,
    Tasks: aggregatedStats.activity[i]
  }));

  // Budget/Stats Bar Chart Data
  const budgetData = days.map((day, i) => ({
    name: day,
    Spend: aggregatedStats.budget[i]
  }));

  return (
    <div className="dashboard-layout">
      {/* Left Main Content */}
      <div className="dashboard-main">
        <header className="page-header">
          <h1>Good morning, Leanne</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Check your daily task & Schedules</p>
        </header>
        
        <div className="dashboard-grid">
          
          {/* Top row mini stats */}
          <div className="card widget-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', paddingBottom: '0.5rem' }}>Total Students Stored</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{students.length}</h3>
            </div>
            <div className="sm-avatar" style={{ backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              📊
            </div>
          </div>

          <div className="card widget-card" style={{ padding: '1rem' }}>
            <h3 className="widget-title" style={{ marginBottom: '0.5rem' }}>Added Students</h3>
            {students.length === 0 ? (
              <p className="empty-state" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No students added yet.</p>
            ) : (
              <div className="student-list" style={{ gap: '0.5rem' }}>
                {students.slice(-2).reverse().map((student, idx) => (
                  <div key={idx} className="student-item" style={{ padding: '0.25rem 0.5rem' }}>
                    <div className="avatar sm-avatar" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>{student.name.charAt(0)}</div>
                    <div className="student-info">
                      <span className="student-name" style={{ fontSize: '0.85rem' }}>{student.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Area Chart */}
          <div className="card widget-card col-span-full" style={{ padding: '1.5rem', height: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="widget-title" style={{ margin: 0 }}>Activity</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', backgroundColor: 'var(--accent-link-bg)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                {students.length === 0 ? '0 Tasks' : 'Tasks Logged'}
              </span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="Tasks" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Budget Bar Chart */}
          <div className="card widget-card col-span-full" style={{ padding: '1.5rem', height: '250px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="widget-title" style={{ margin: 0 }}>$1380 <span style={{fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)'}}>This week</span></h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Budget</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }} barSize={20}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'var(--card-bg-darker)', borderRadius: '8px', border: 'none', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="Spend" fill="var(--success-color)" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

      {/* Right Sidebar Stats (Matching example.jpg) */}
      <div className="dashboard-sidebar-right">
        <div className="card stats-card-right">
          <div className="stat-item">
            <span className="stat-title" style={{ color: 'var(--text-primary)'}}>Attendance</span>
            <div className="circular-progress pink" style={{ background: `conic-gradient(var(--accent-color) ${aggregatedStats.attendance}%, rgba(255,255,255,0.1) 0deg)`}}>
              <span className="progress-value">{aggregatedStats.attendance}%</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-title" style={{ color: 'var(--text-primary)'}}>Homework</span>
            <div className="circular-progress teal" style={{ background: `conic-gradient(var(--success-color) ${aggregatedStats.homework}%, rgba(255,255,255,0.1) 0deg)`}}>
              <span className="progress-value">{aggregatedStats.homework}%</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-title" style={{ color: 'var(--text-primary)'}}>Rating</span>
            <div className="circular-progress yellow" style={{ background: `conic-gradient(var(--warning-color) ${aggregatedStats.rating}%, rgba(255,255,255,0.1) 0deg)`}}>
              <span className="progress-value">{aggregatedStats.rating}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
