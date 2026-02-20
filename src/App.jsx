import { createHashRouter, RouterProvider, Outlet } from 'react-router';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import Counter from './pages/Counter';
import StudentDetails from './pages/StudentDetails';
import { ThemeProvider } from './ThemeContext';
import './App.css'; // Minimal specific styles if needed

const Layout = () => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "students", element: <Students /> },
      { path: "student/:id", element: <StudentDetails /> },
      { path: "add", element: <AddStudent /> },
      { path: "counter", element: <Counter /> }
    ]
  }
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
