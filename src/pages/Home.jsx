import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, Download, ExternalLink, Code2, Github, ChevronDown,
    Brain, Smartphone, Globe, Cpu, Star, Sparkles, Camera, Pencil, Check
} from 'lucide-react';
import api from '../utils/api';
import defaultProfile from '../assets/profile.jpg';

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
};

const skills = [
    { name: 'HTML', level: 90, color: 'from-orange-400 to-red-500', icon: '🌐' },
    { name: 'JavaScript', level: 80, color: 'from-yellow-400 to-amber-500', icon: '⚡' },
    { name: 'Python', level: 75, color: 'from-blue-400 to-indigo-500', icon: '🐍' },
];

const tools = [
    { name: 'VS Code', icon: '💻', color: 'from-blue-500 to-blue-600' },
    { name: 'GitHub', icon: '🐙', color: 'from-slate-500 to-slate-700' },
    { name: 'Vercel', icon: '▲', color: 'from-slate-600 to-slate-800' },
    { name: 'Figma', icon: '🎨', color: 'from-purple-500 to-pink-500' },
    { name: 'Canva', icon: '🖼', color: 'from-cyan-500 to-blue-500' },
    { name: 'Antigravity', icon: '🚀', color: 'from-primary-500 to-accent-500' },
];

const TypewriterText = ({ texts }) => {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const current = texts[textIndex];
            if (!isDeleting) {
                setDisplayText(current.slice(0, charIndex + 1));
                if (charIndex + 1 === current.length) {
                    setTimeout(() => setIsDeleting(true), 1500);
                } else {
                    setCharIndex(c => c + 1);
                }
            } else {
                setDisplayText(current.slice(0, charIndex - 1));
                if (charIndex - 1 === 0) {
                    setIsDeleting(false);
                    setTextIndex(i => (i + 1) % texts.length);
                    setCharIndex(0);
                } else {
                    setCharIndex(c => c - 1);
                }
            }
        }, isDeleting ? 60 : 100);
        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, textIndex, texts]);

    return (
        <span className="gradient-text">
            {displayText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

export default function Home() {
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [skillsVisible, setSkillsVisible] = useState(false);
    const skillsRef = useRef(null);
    const fileInputRef = useRef(null);
    const nameInputRef = useRef(null);

    const [profileImage, setProfileImage] = useState(() => {
        return localStorage.getItem('portfolioProfileImage') || defaultProfile;
    });
    const [profileName, setProfileName] = useState(() => {
        return localStorage.getItem('portfolioProfileName') || 'DINESH.P';
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(profileName);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            setProfileImage(dataUrl);
            localStorage.setItem('portfolioProfileImage', dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleNameSave = () => {
        const trimmed = tempName.trim() || 'DINESH.P';
        setProfileName(trimmed);
        localStorage.setItem('portfolioProfileName', trimmed);
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e) => {
        if (e.key === 'Enter') handleNameSave();
        if (e.key === 'Escape') {
            setTempName(profileName);
            setIsEditingName(false);
        }
    };

    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [isEditingName]);

    useEffect(() => {
        api.get('/projects?featured=true').then(res => {
            setFeaturedProjects(res.data.projects || []);
        }).catch(() => {
            // Default project if no backend
            setFeaturedProjects([{
                _id: '1',
                title: 'Deena Wine Website',
                description: 'A responsive website developed and deployed using modern web technologies.',
                projectLink: 'https://deena-wine.vercel.app/',
                technologies: ['HTML', 'CSS', 'JavaScript'],
                category: 'web',
                featured: true,
            }]);
        });

        // Track visit
        const sessionId = sessionStorage.getItem('sessionId') || Math.random().toString(36).slice(2);
        sessionStorage.setItem('sessionId', sessionId);
        api.post('/visitors/track', { page: '/', sessionId }).catch(() => { });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); },
            { threshold: 0.3 }
        );
        if (skillsRef.current) observer.observe(skillsRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative">
            {/* ─── Hero Section ─── */}
            <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
                {/* Glow orbs */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left content */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    Open to opportunities
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-4">
                                    Hi, I'm <br />
                                    <TypewriterText texts={['DINESH.P', 'an AI Student', 'App Developer', 'UI Designer']} />
                                </h1>

                                <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                                    B.Tech Artificial Intelligence & Data Science Student passionate about building
                                    modern digital applications and beautiful user experiences.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Link to="/projects" className="btn-primary text-base px-8 py-3.5">
                                        View Projects <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link to="/contact" className="btn-secondary text-base px-8 py-3.5">
                                        Contact Me <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Stats row */}
                                <div className="flex gap-8 mt-12 pt-8 border-t border-slate-700/50">
                                    {[
                                        { value: '1+', label: 'Project' },
                                        { value: '3+', label: 'Skills' },
                                        { value: '6+', label: 'Tools' },
                                    ].map(s => (
                                        <div key={s.label}>
                                            <div className="text-3xl font-bold gradient-text font-display">{s.value}</div>
                                            <div className="text-slate-400 text-sm">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right – Avatar Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col items-center gap-6 justify-center"
                        >
                            <div className="relative">
                                {/* Rotating ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-500/30 animate-spin"
                                    style={{ animationDuration: '20s' }} />
                                <div className="absolute inset-4 rounded-full border-2 border-dashed border-accent-500/20 animate-spin"
                                    style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

                                {/* Main avatar with real photo */}
                                <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 border-4 border-primary-500/50 flex items-center justify-center shadow-2xl shadow-primary-500/30 overflow-hidden">
                                    <img
                                        src={profileImage}
                                        alt="Dinesh P - Profile"
                                        className="w-full h-full object-cover object-top"
                                    />

                                    {/* Floating badges */}
                                    <div className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 text-xs font-medium text-primary-400 border border-primary-500/30">
                                        <div className="flex items-center gap-1.5">
                                            <Brain className="w-3.5 h-3.5" /> AI & DS
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 text-xs font-medium text-accent-400 border border-accent-500/30">
                                        <div className="flex items-center gap-1.5">
                                            <Smartphone className="w-3.5 h-3.5" /> App Dev
                                        </div>
                                    </div>
                                    <div className="absolute top-8 -right-12 glass rounded-xl px-3 py-2 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                                        <div className="flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5" /> Web
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Name with Edit */}
                            <div className="flex flex-col items-center gap-1.5 mt-1">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onKeyDown={handleNameKeyDown}
                                            onBlur={handleNameSave}
                                            className="bg-slate-800/80 border border-primary-500/50 text-white text-xl font-bold font-display text-center rounded-lg px-3 py-1 outline-none focus:border-primary-400 w-48 tracking-widest"
                                            maxLength={30}
                                        />
                                        <button
                                            onClick={handleNameSave}
                                            className="p-1.5 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 hover:bg-primary-500/30 transition-all"
                                            title="Save name"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Name */}
                                        <span className="text-xl font-bold font-display gradient-text tracking-widest">
                                            {profileName}
                                        </span>
                                        {/* Edit icon — below the name */}
                                        <button
                                            onClick={() => { setTempName(profileName); setIsEditingName(true); }}
                                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 border border-transparent hover:border-primary-500/20 transition-all text-xs"
                                            title="Edit name"
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Change Photo Button */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                id="profile-image-upload"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium hover:bg-primary-500/20 hover:border-primary-500/50 transition-all duration-200 cursor-pointer"
                            >
                                <Camera className="w-4 h-4" />
                                Change Photo
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
                >
                    <span className="text-xs">Scroll down</span>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </section>

            {/* ─── Featured Skills ─── */}
            <section ref={skillsRef} className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeUp}
                        viewport={{ once: true }}
                        whileInView="animate"
                        initial="initial"
                        className="text-center mb-16"
                    >
                        <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">What I Know</span>
                        <h2 className="section-title">Featured <span className="gradient-text">Skills</span></h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <div className="card group hover-lift">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-2xl shadow-lg`}>
                                            {skill.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{skill.name}</h3>
                                            <span className="text-slate-400 text-sm">{skill.level}% Proficiency</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                                            initial={{ width: 0 }}
                                            animate={skillsVisible ? { width: `${skill.level}%` } : { width: 0 }}
                                            transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/skills" className="btn-secondary">
                            View All Skills <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Tools & Technologies ─── */}
            <section className="py-24 bg-dark-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeUp}
                        whileInView="animate"
                        initial="initial"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">My Toolkit</span>
                        <h2 className="section-title">Tools & <span className="gradient-text">Technologies</span></h2>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {tools.map((tool, i) => (
                            <motion.div
                                key={tool.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07, duration: 0.4 }}
                                className="card flex flex-col items-center gap-3 py-6 group hover-lift cursor-default"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                    {tool.icon}
                                </div>
                                <span className="text-sm font-medium text-slate-300">{tool.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Featured Project ─── */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...fadeUp}
                        whileInView="animate"
                        initial="initial"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">My Work</span>
                        <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProjects.map((project, i) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="card group hover-lift"
                            >
                                {/* Image placeholder */}
                                <div className="w-full h-44 rounded-xl mb-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                                    {project.image ? (
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-600">
                                            <Globe className="w-12 h-12" />
                                            <span className="text-xs">Website Preview</span>
                                        </div>
                                    )}
                                </div>
                                {/* Featured badge */}
                                {project.featured && (
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-medium text-amber-400">Featured</span>
                                    </div>
                                )}
                                <h3 className="font-semibold text-white text-lg mb-2">{project.title}</h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {(project.technologies || []).map(t => (
                                        <span key={t} className="badge badge-info">{t}</span>
                                    ))}
                                </div>
                                {project.projectLink && (
                                    <a
                                        href={project.projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View Live Project
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/projects" className="btn-primary">
                            All Projects <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ─── */}
            <section className="py-24 bg-dark-800/30">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="glass rounded-3xl p-12 border border-primary-500/20 relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <Cpu className="w-12 h-12 text-primary-400 mx-auto mb-6" />
                                <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                    Let's Build Something <span className="gradient-text">Amazing</span>
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                                    Looking for a passionate developer for your next project? I'm available for freelance work and internships.
                                </p>
                                <Link to="/contact" className="btn-primary text-base px-8 py-4">
                                    Get In Touch <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
