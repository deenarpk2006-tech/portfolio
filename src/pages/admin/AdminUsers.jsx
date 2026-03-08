import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff, UserX, Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users?search=${search}&page=${page}&limit=${limit}`);
            setUsers(data.users || []);
            setTotal(data.pagination?.total || 0);
            setTotalPages(data.pagination?.pages || 1);
        } catch {
            toast.error('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [search, page]);

    const toggleBlock = async (id, isBlocked, name) => {
        try {
            const { data } = await api.patch(`/users/${id}/block`);
            toast.success(data.message);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user.');
        }
    };

    const deleteUser = async (id, name) => {
        if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success('User deleted successfully.');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">User Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage registered users ({total} total)</p>
                </div>
                <button onClick={fetchUsers} className="p-2 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-colors" title="Refresh">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </motion.div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="input-field pl-10"
                />
            </div>

            {/* Table */}
            <div className="stats-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j}><div className="h-4 bg-slate-700/50 rounded animate-pulse" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-slate-400">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>No users found.</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-slate-400">{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {user.isBlocked ? (
                                                <span className="badge badge-danger">Blocked</span>
                                            ) : user.isActive ? (
                                                <span className="badge badge-success">Active</span>
                                            ) : (
                                                <span className="badge badge-warning">Inactive</span>
                                            )}
                                        </td>
                                        <td className="text-slate-400 text-xs">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {user.role !== 'admin' && (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => toggleBlock(user._id, user.isBlocked, user.name)}
                                                        title={user.isBlocked ? 'Unblock' : 'Block'}
                                                        className={`p-1.5 rounded-lg transition-colors ${user.isBlocked
                                                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                                                : 'text-amber-400 hover:bg-amber-500/10'
                                                            }`}
                                                    >
                                                        {user.isBlocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user._id, user.name)}
                                                        title="Delete"
                                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
                        <p className="text-slate-400 text-sm">
                            Page {page} of {totalPages} ({total} users)
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-400 text-sm hover:border-primary-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-400 text-sm hover:border-primary-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
