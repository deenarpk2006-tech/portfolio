import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FolderOpen, MessageSquare, Eye, TrendingUp, Activity, ArrowUp, Clock } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../../utils/api';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className={`stats-card`}>
        <div className="flex items-start justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend !== undefined && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                    <ArrowUp className="w-3 h-3" />
                    {trend}%
                </div>
            )}
        </div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold font-display text-white">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass rounded-xl px-4 py-3 border border-slate-700/50 text-sm">
                <p className="text-slate-300 mb-1">{label}</p>
                <p className="text-primary-400 font-bold">{payload[0].value} visitors</p>
            </div>
        );
    }
    return null;
};

const mockStats = {
    totalUsers: 12,
    totalProjects: 3,
    totalMessages: 8,
    totalVisitors: 247,
    unreadMessages: 3,
    activeUsers: 10,
    blockedUsers: 2,
    visitorChart: [
        { date: 'Mon', visitors: 12 },
        { date: 'Tue', visitors: 19 },
        { date: 'Wed', visitors: 8 },
        { date: 'Thu', visitors: 27 },
        { date: 'Fri', visitors: 35 },
        { date: 'Sat', visitors: 22 },
        { date: 'Sun', visitors: 18 },
    ],
    recentActivities: [
        { type: 'user', message: 'New user registered: John Doe', time: new Date() },
        { type: 'contact', message: 'New message from: Alice', time: new Date(Date.now() - 3600000) },
        { type: 'user', message: 'New user registered: Bob Smith', time: new Date(Date.now() - 7200000) },
    ],
};

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/stats')
            .then(res => setStats(res.data.stats))
            .catch(() => setStats(mockStats))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="stats-card animate-pulse">
                            <div className="w-12 h-12 bg-slate-700 rounded-xl mb-3" />
                            <div className="h-3 bg-slate-700 rounded mb-2 w-1/2" />
                            <div className="h-8 bg-slate-700 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const s = stats || mockStats;

    const statCards = [
        { title: 'Total Users', value: s.totalUsers, icon: Users, color: 'bg-primary-500/20 text-primary-400', trend: 12, subtitle: `${s.activeUsers} active` },
        { title: 'Total Projects', value: s.totalProjects, icon: FolderOpen, color: 'bg-accent-500/20 text-accent-400' },
        { title: 'Messages', value: s.totalMessages, icon: MessageSquare, color: 'bg-emerald-500/20 text-emerald-400', subtitle: `${s.unreadMessages} unread` },
        { title: 'Total Visitors', value: s.totalVisitors, icon: Eye, color: 'bg-amber-500/20 text-amber-400', trend: 8 },
    ];

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <motion.div {...fadeUp()}>
                <h1 className="text-2xl font-bold font-display text-white">Dashboard Overview</h1>
                <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening with your portfolio.</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div key={card.title} {...fadeUp(i * 0.07)}>
                        <StatCard {...card} />
                    </motion.div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visitor Chart */}
                <motion.div {...fadeUp(0.3)} className="lg:col-span-2 stats-card">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary-400" />
                        <h3 className="font-semibold text-white">Visitor Analytics (Last 7 Days)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={s.visitorChart || []}>
                            <defs>
                                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="visitors" stroke="#0ea5e9" strokeWidth={2} fill="url(#visitorsGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Quick stats */}
                <motion.div {...fadeUp(0.35)} className="stats-card space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-accent-400" />
                        <h3 className="font-semibold text-white">User Stats</h3>
                    </div>
                    {[
                        { label: 'Active Users', value: s.activeUsers, total: s.totalUsers, color: 'bg-emerald-400' },
                        { label: 'Blocked Users', value: s.blockedUsers, total: s.totalUsers, color: 'bg-red-400' },
                    ].map(item => (
                        <div key={item.label}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">{item.label}</span>
                                <span className="text-white font-medium">{item.value}</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                                    style={{ width: item.total ? `${(item.value / item.total) * 100}%` : '0%' }}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 border-t border-slate-700/50">
                        <p className="text-slate-400 text-xs mb-2">Quick Actions</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="/admin/projects" className="text-center py-2 px-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium hover:bg-primary-500/20 transition-colors">
                                + Project
                            </a>
                            <a href="/admin/messages" className="text-center py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                                Messages
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div {...fadeUp(0.4)} className="stats-card">
                <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                    {(s.recentActivities || []).map((activity, i) => (
                        <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-700/30 last:border-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${activity.type === 'user' ? 'bg-primary-500/20 text-primary-400' : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                {activity.type === 'user' ? '👤' : '✉️'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-300 text-sm">{activity.message}</p>
                                <p className="text-slate-500 text-xs mt-0.5">
                                    {new Date(activity.time).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {!(s.recentActivities?.length) && (
                        <p className="text-slate-500 text-sm text-center py-4">No recent activity</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
