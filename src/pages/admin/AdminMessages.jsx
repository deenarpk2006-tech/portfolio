import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2, Mail, Phone, Check, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const statusColors = {
    unread: 'badge-danger',
    read: 'badge-warning',
    replied: 'badge-success',
};

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const params = filterStatus ? `?status=${filterStatus}` : '';
            const { data } = await api.get(`/contact${params}`);
            setMessages(data.messages || []);
            setUnreadCount(data.unreadCount || 0);
        } catch {
            toast.error('Failed to load messages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, [filterStatus]);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/contact/${id}/status`, { status });
            toast.success(`Marked as ${status}.`);
            fetchMessages();
            if (selectedMsg?._id === id) {
                setSelectedMsg(prev => ({ ...prev, status }));
            }
        } catch {
            toast.error('Failed to update status.');
        }
    };

    const deleteMsg = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            await api.delete(`/contact/${id}`);
            toast.success('Message deleted.');
            if (selectedMsg?._id === id) setSelectedMsg(null);
            fetchMessages();
        } catch {
            toast.error('Failed to delete message.');
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
                    <h1 className="text-2xl font-bold font-display text-white">Messages</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Contact form submissions · <span className="text-red-400">{unreadCount} unread</span>
                    </p>
                </div>
                <button onClick={fetchMessages} className="p-2 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </motion.div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {[
                    { value: '', label: 'All' },
                    { value: 'unread', label: 'Unread' },
                    { value: 'read', label: 'Read' },
                    { value: 'replied', label: 'Replied' },
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilterStatus(f.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === f.value
                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                : 'text-slate-400 border border-slate-700/50 hover:border-primary-500/30'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Message list */}
                <div className="space-y-2">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="stats-card animate-pulse">
                                <div className="h-4 bg-slate-700 rounded mb-2 w-1/2" />
                                <div className="h-3 bg-slate-700/50 rounded w-3/4" />
                            </div>
                        ))
                    ) : messages.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No messages found.</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                key={msg._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => {
                                    setSelectedMsg(msg);
                                    if (msg.status === 'unread') updateStatus(msg._id, 'read');
                                }}
                                className={`stats-card cursor-pointer transition-all duration-200 ${selectedMsg?._id === msg._id
                                        ? 'border-primary-500/40 bg-primary-500/5'
                                        : 'hover:border-slate-600'
                                    } ${msg.status === 'unread' ? 'border-l-2 border-l-red-400' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white text-sm">{msg.name}</span>
                                            <span className={`badge ${statusColors[msg.status] || ''}`}>{msg.status}</span>
                                        </div>
                                        <p className="text-slate-400 text-xs mb-1">{msg.subject}</p>
                                        <p className="text-slate-500 text-xs line-clamp-1">{msg.message}</p>
                                    </div>
                                    <p className="text-slate-600 text-xs flex-shrink-0">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Message detail */}
                {selectedMsg ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="stats-card border border-slate-700"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-white">{selectedMsg.subject}</h3>
                            <span className={`badge ${statusColors[selectedMsg.status] || ''}`}>{selectedMsg.status}</span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500 w-16">From:</span>
                                <span className="text-white font-medium">{selectedMsg.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500 w-16">Email:</span>
                                <a href={`mailto:${selectedMsg.email}`} className="text-primary-400 hover:underline flex items-center gap-1">
                                    <Mail className="w-3 h-3" />{selectedMsg.email}
                                </a>
                            </div>
                            {selectedMsg.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-slate-500 w-16">Phone:</span>
                                    <a href={`tel:${selectedMsg.phone}`} className="text-primary-400 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />{selectedMsg.phone}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500 w-16">Date:</span>
                                <span className="text-slate-400">{new Date(selectedMsg.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                            <p className="text-slate-300 text-sm leading-relaxed">{selectedMsg.message}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                                onClick={() => updateStatus(selectedMsg._id, 'replied')}
                                className="btn-primary text-sm px-4 py-2"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                Reply via Email
                            </a>
                            <button
                                onClick={() => updateStatus(selectedMsg._id, 'replied')}
                                className="btn-secondary text-sm px-4 py-2"
                            >
                                <Check className="w-3.5 h-3.5" />
                                Mark Replied
                            </button>
                            <button
                                onClick={() => deleteMsg(selectedMsg._id)}
                                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="stats-card flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Click a message to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
