import { Link } from 'react-router-dom';
import { Code2, Mail, Phone, Github, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-slate-700/50 bg-dark-900/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-display font-bold text-xl gradient-text">DINESH.P</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            B.Tech Artificial Intelligence & Data Science student passionate about building modern digital applications.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 font-display">Quick Links</h3>
                        <div className="space-y-2">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/about', label: 'About' },
                                { to: '/skills', label: 'Skills' },
                                { to: '/projects', label: 'Projects' },
                                { to: '/contact', label: 'Contact' },
                            ].map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="block text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 font-display">Get In Touch</h3>
                        <div className="space-y-3">
                            <a
                                href="mailto:deenarpk2006@gmail.com"
                                className="flex items-center gap-3 text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                                    <Mail className="w-3.5 h-3.5 text-primary-400" />
                                </div>
                                deenarpk2006@gmail.com
                            </a>
                            <a
                                href="tel:+918610281626"
                                className="flex items-center gap-3 text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                                    <Phone className="w-3.5 h-3.5 text-primary-400" />
                                </div>
                                +91 8610281626
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                                    <Github className="w-3.5 h-3.5 text-primary-400" />
                                </div>
                                GitHub
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm flex items-center gap-1.5">
                        © {year} P. Dinesh. Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                            ● Available for work
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
