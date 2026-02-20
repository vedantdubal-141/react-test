import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import Counter from './pages/Counter';
import StudentDetails from './pages/StudentDetails';
import { ThemeProvider } from './ThemeContext';
import './App.css'; // Minimal specific styles if needed

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/students" element={<Students />} />
              <Route path="/student/:id" element={<StudentDetails />} />
              <Route path="/add" element={<AddStudent />} />
              <Route path="/counter" element={<Counter />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
