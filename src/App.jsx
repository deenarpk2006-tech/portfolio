import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import useAuthStore from './store/authStore';

// 👇 Replace this with your real Google OAuth Client ID from console.cloud.google.com
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

// Portfolio Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticlesBg from './components/ParticlesBg';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProjects from './pages/admin/AdminProjects';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMessages from './pages/admin/AdminMessages';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Portfolio Layout
const PortfolioLayout = ({ children }) => (
  <div className="min-h-screen bg-dark-900 text-slate-200 relative">
    <ParticlesBg />
    <div className="grid-bg fixed inset-0 pointer-events-none z-0" />
    <div className="relative z-10">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  </div>
);

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#0ea5e9', secondary: '#f1f5f9' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
        }}
      />

      <Routes>
        {/* Portfolio routes */}
        <Route path="/" element={<PortfolioLayout><Home /></PortfolioLayout>} />
        <Route path="/about" element={<PortfolioLayout><About /></PortfolioLayout>} />
        <Route path="/skills" element={<PortfolioLayout><Skills /></PortfolioLayout>} />
        <Route path="/projects" element={<PortfolioLayout><Projects /></PortfolioLayout>} />
        <Route path="/contact" element={<PortfolioLayout><Contact /></PortfolioLayout>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}
