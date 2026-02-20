import { useState } from 'react';

function AddStudent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '' // initially untouched
  });
  
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [recentStudent, setRecentStudent] = useState(null); // Bonus: Display newly added student

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name cannot be empty';
    if (!formData.email.includes('@')) newErrors.email = 'Email must contain "@"';
    
    // Check exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    
    if (validate()) {
      // Store in localStorage
      const newStudent = { 
        ...formData, 
        id: Date.now(),
        // V2 Default Stats
        stats: {
          attendance: 0,
          homework: 0,
          rating: 0,
          activity: [0, 0, 0, 0, 0, 0, 0] // Mon-Sun
        }
      };
      
      const existing = localStorage.getItem('students');
      let studentsArray = [];
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (Array.isArray(parsed)) {
            studentsArray = parsed;
          }
        } catch (e) {
          studentsArray = [];
        }
      }
      
      studentsArray.push(newStudent);
      localStorage.setItem('students', JSON.stringify(studentsArray));
      
      setSuccessMsg('Student added successfully!');
      setRecentStudent(newStudent);
      
      // Clear form fields
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: ''
      });
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Add New Student</h1>
      </header>

      <div className="card flex-col">
        {successMsg && <div className="text-success" style={{ marginBottom: '1rem', fontSize: '1rem', padding: '0.75rem', backgroundColor: 'rgba(81, 145, 136, 0.1)', borderRadius: 'var(--border-radius-sm)' }}>{successMsg}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="form-control" 
              value={formData.name} 
              onChange={handleChange} 
            />
            {errors.name && <span className="text-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="form-control" 
              value={formData.email} 
              onChange={handleChange} 
            />
            {errors.email && <span className="text-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone (10 digits) *</label>
            <input 
              type="text" 
              id="phone" 
              name="phone" 
              className="form-control" 
              value={formData.phone} 
              onChange={handleChange} 
            />
            {errors.phone && <span className="text-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <div className="radio-group" style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Male" 
                  checked={formData.gender === 'Male'} 
                  onChange={handleChange} 
                /> Male
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Female" 
                  checked={formData.gender === 'Female'} 
                  onChange={handleChange} 
                /> Female
              </label>
            </div>
            {errors.gender && <span className="text-error">{errors.gender}</span>}
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>
        </form>
      </div>

      {/* Bonus requirement: Display newly added student immediately */}
      {recentStudent && (
        <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid var(--success-color)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Recently Added</h3>
          <p><strong>Name:</strong> {recentStudent.name}</p>
          <p><strong>Email:</strong> {recentStudent.email}</p>
          <p><strong>Phone:</strong> {recentStudent.phone}</p>
          <p><strong>Gender:</strong> {recentStudent.gender}</p>
        </div>
      )}
    </div>
  );
}

export default AddStudent;
