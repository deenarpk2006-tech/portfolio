import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/contact', form);
            if (data.success) {
                setSent(true);
                toast.success('Message sent successfully!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        { icon: Mail, label: 'Email', value: 'deenarpk2006@gmail.com', href: 'mailto:deenarpk2006@gmail.com', color: 'text-primary-400' },
        { icon: Phone, label: 'Phone', value: '+91 8610281626', href: 'tel:+918610281626', color: 'text-accent-400' },
        { icon: MapPin, label: 'Location', value: 'Tamil Nadu, India', href: null, color: 'text-emerald-400' },
    ];

    return (
        <div className="pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">Get In Touch</span>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        Contact <span className="gradient-text">Me</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Have a project in mind or want to collaborate? I'd love to hear from you!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left – Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Contact cards */}
                        {contactInfo.map(item => (
                            <div key={item.label} className="card flex items-center gap-4 py-5 hover-lift">
                                <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className={`font-medium hover:underline ${item.color}`}>{item.value}</a>
                                    ) : (
                                        <p className="text-white font-medium">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Social */}
                        <div className="card">
                            <h3 className="text-white font-semibold mb-4">Follow Me</h3>
                            <div className="flex gap-3">
                                {[
                                    { icon: Github, href: 'https://github.com', label: 'GitHub' },
                                    { icon: Linkedin, href: '#', label: 'LinkedIn' },
                                ].map(s => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all duration-200"
                                        title={s.label}
                                    >
                                        <s.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="card border border-emerald-500/20 bg-emerald-500/5">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                                <div>
                                    <p className="text-white font-medium">Available for work</p>
                                    <p className="text-slate-400 text-sm">Open for freelance & internships</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right – Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="card border border-primary-500/20">
                            {sent ? (
                                <div className="text-center py-16">
                                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-slate-400 mb-6">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                                    <button
                                        onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                        className="btn-primary"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Name <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Your full name"
                                                    className="input-field"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Email <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="your@email.com"
                                                    className="input-field"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="input-field"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Subject <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={form.subject}
                                                    onChange={handleChange}
                                                    placeholder="What's it about?"
                                                    className="input-field"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Message <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder="Tell me about your project or inquiry..."
                                                className="input-field resize-none"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
