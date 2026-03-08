import { create } from 'zustand';
import api from '../utils/api';

// ─── Admin credentials (local fallback – works without backend) ───
const ADMIN_EMAIL = 'deenarpk2006@gmail.com';
const ADMIN_PASSWORD = 'Admin@123456';
// Allowed Google accounts for admin access
const ADMIN_GOOGLE_EMAILS = ['deenarpk2006@gmail.com'];

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    // ─── Email/Password Login ─────────────────────────────────────
    login: async (email, password) => {
        set({ isLoading: true, error: null });

        // 1. Try local admin check first (always works)
        const emailLower = email.trim().toLowerCase();
        if (emailLower === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
            const adminUser = { id: 'local-admin', name: 'Dinesh P', email: ADMIN_EMAIL, role: 'admin', isActive: true };
            const fakeToken = btoa(JSON.stringify({ id: 'local-admin', role: 'admin', exp: Date.now() + 7 * 86400000 }));
            localStorage.setItem('token', fakeToken);
            localStorage.setItem('user', JSON.stringify(adminUser));
            set({ user: adminUser, token: fakeToken, isAuthenticated: true, isLoading: false });
            return { success: true, user: adminUser };
        }

        // 2. Fallback: try backend (if running)
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
                return { success: true, user: data.user };
            }
        } catch {
            // backend not running — that's fine, local check already failed above
        }

        set({ isLoading: false });
        return { success: false, message: 'Invalid email or password.' };
    },

    // ─── Google OAuth Login ───────────────────────────────────────
    googleLogin: (googleUser) => {
        const email = googleUser.email?.toLowerCase();
        if (!ADMIN_GOOGLE_EMAILS.includes(email)) {
            return { success: false, message: 'This Google account is not authorized as admin.' };
        }
        const adminUser = {
            id: 'google-admin',
            name: googleUser.name || 'Dinesh P',
            email: googleUser.email,
            role: 'admin',
            isActive: true,
            picture: googleUser.picture,
        };
        const fakeToken = btoa(JSON.stringify({ id: 'google-admin', role: 'admin', exp: Date.now() + 7 * 86400000 }));
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(adminUser));
        set({ user: adminUser, token: fakeToken, isAuthenticated: true });
        return { success: true, user: adminUser };
    },

    // ─── Logout ───────────────────────────────────────────────────
    logout: async () => {
        try { await api.post('/auth/logout'); } catch { }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
