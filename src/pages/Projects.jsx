import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Globe, Star, Filter, Search } from 'lucide-react';
import api from '../utils/api';

const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'ai', label: 'AI / ML' },
    { value: 'other', label: 'Other' },
];

const defaultProjects = [
    {
        _id: '1',
        title: 'Deena Wine Website',
        description: 'A responsive website developed and deployed using modern web technologies. Features a clean, modern design with smooth animations and mobile-first responsive layout.',
        shortDescription: 'A modern responsive web application built with modern web technologies.',
        projectLink: 'https://deena-wine.vercel.app/',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        category: 'web',
        featured: true,
        isPublished: true,
    },
];

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/projects')
            .then(res => {
                const data = res.data.projects || [];
                setProjects(data.length ? data : defaultProjects);
                setFiltered(data.length ? data : defaultProjects);
            })
            .catch(() => {
                setProjects(defaultProjects);
                setFiltered(defaultProjects);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = projects;
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.technologies?.some(t => t.toLowerCase().includes(q))
            );
        }
        setFiltered(result);
    }, [activeCategory, searchQuery, projects]);

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
                    <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">My Work</span>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        My <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A collection of projects I've built – from concept to deployment.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 mb-10"
                >
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat.value
                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                        : 'text-slate-400 border border-slate-700/50 hover:border-primary-500/30 hover:text-primary-400'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Count */}
                <div className="flex items-center gap-2 mb-6 text-slate-400 text-sm">
                    <Filter className="w-3.5 h-3.5" />
                    Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-44 bg-slate-700/50 rounded-xl mb-4" />
                                <div className="h-4 bg-slate-700/50 rounded mb-2" />
                                <div className="h-3 bg-slate-700/30 rounded mb-4 w-3/4" />
                                <div className="h-3 bg-slate-700/30 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24 text-slate-400"
                            >
                                <Globe className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p>No projects found matching your criteria.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filtered.map((project, i) => (
                                    <motion.div
                                        key={project._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                        className="card group hover-lift flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="w-full h-44 rounded-xl mb-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                                            {project.image ? (
                                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-600">
                                                    <Globe className="w-10 h-10" />
                                                    <span className="text-xs">Preview</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Featured badge */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {project.featured && (
                                                <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
                                                    <Star className="w-3 h-3 fill-amber-400" /> Featured
                                                </span>
                                            )}
                                            <span className="badge badge-info capitalize">{project.category}</span>
                                        </div>

                                        <h3 className="font-semibold text-white text-lg mb-2">{project.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">{project.description}</p>

                                        {/* Tech tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {(project.technologies || []).map(t => (
                                                <span key={t} className="badge badge-info">{t}</span>
                                            ))}
                                        </div>

                                        {/* Links */}
                                        <div className="flex gap-3 pt-3 border-t border-slate-700/50">
                                            {project.projectLink && (
                                                <a
                                                    href={project.projectLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Live Demo
                                                </a>
                                            )}
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                                                >
                                                    <Github className="w-3.5 h-3.5" />
                                                    Source
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

            </div>
        </div>
    );
}
