import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '../../store/authStore';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { login, googleLogin } = useAuthStore();
    const navigate = useNavigate();

    // ── Email/Password submit ──────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result?.success) {
            if (result.user?.role === 'admin') {
                toast.success('Welcome back, Admin! 🎉');
                navigate('/admin');
            } else {
                toast.error('Access denied. Admin only.');
            }
        } else {
            toast.error(result?.message || 'Invalid credentials.');
        }
    };

    // ── Google Sign-In ────────────────────────────────────────────
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            try {
                // Fetch user info from Google
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const googleUser = await res.json();
                const result = googleLogin(googleUser);
                if (result?.success) {
                    toast.success(`Welcome, ${googleUser.name}! 🎉`);
                    navigate('/admin');
                } else {
                    toast.error(result?.message || 'Google account not authorized.');
                }
            } catch {
                toast.error('Google sign-in failed. Please try again.');
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            toast.error('Google sign-in was cancelled or failed.');
            setGoogleLoading(false);
        },
    });

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 grid-bg" />
            <div className="absolute top-1/4 -left-32 w-72 h-72 bg-primary-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-mesh" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Card */}
                <div className="glass rounded-3xl p-8 border border-slate-700/50 shadow-2xl shadow-black/40">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30"
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold font-display text-white">Admin Portal</h1>
                        <p className="text-slate-400 text-sm mt-1">Sign in to access the dashboard</p>
                    </div>

                    {/* ── Google Sign-In Button ── */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleGoogleLogin()}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-slate-600/60 hover:bg-white/10 hover:border-slate-500 transition-all duration-200 text-white font-medium text-sm mb-6 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-slate-700/60" />
                        <span className="text-slate-500 text-xs font-medium">or sign in with email</span>
                        <div className="flex-1 h-px bg-slate-700/60" />
                    </div>

                    {/* ── Email / Password Form ── */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="input-field pl-10"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-field pl-10 pr-10"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3.5 text-base mt-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
                        <p className="text-slate-500 text-xs">
                            🔒 Secured with JWT authentication
                        </p>
                    </div>
                </div>

                {/* Back to portfolio */}
                <div className="text-center mt-4">
                    <a href="/" className="text-slate-400 hover:text-primary-400 text-sm transition-colors">
                        ← Back to Portfolio
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
