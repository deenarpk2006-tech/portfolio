import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FolderOpen, Users, MessageSquare, LogOut,
    Code2, Menu, X, Shield, ChevronRight, Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const sidebarItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully.');
        navigate('/admin/login');
    };

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    const Sidebar = () => (
        <div className="admin-sidebar">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700/50">
                <Link to="/" className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-lg gradient-text">DINESH.P</span>
                </Link>
                <div className="flex items-center gap-1.5 mt-2">
                    <Shield className="w-3.5 h-3.5 text-primary-400" />
                    <span className="text-slate-400 text-xs">Admin Panel</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {sidebarItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`sidebar-item ${isActive(item) ? 'active' : ''}`}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                        {isActive(item) && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="p-4 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                        <p className="text-slate-500 text-xs truncate">{user?.email || ''}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full sidebar-item text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-900 text-slate-200 flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="lg:hidden z-40"
                        >
                            <Sidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="glass border-b border-slate-700/50 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                        <h2 className="font-display font-semibold text-white capitalize">
                            {sidebarItems.find(s => isActive(s))?.label || 'Dashboard'}
                        </h2>
                        <p className="text-slate-500 text-xs">Admin Dashboard</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            target="_blank"
                            className="text-xs text-slate-400 hover:text-primary-400 transition-colors hidden sm:block"
                        >
                            View Portfolio →
                        </Link>
                        <button className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700/50">
                            <Bell className="w-4 h-4" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
