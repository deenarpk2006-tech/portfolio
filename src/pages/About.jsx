import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Code2, Heart, Download, MapPin, Mail, Phone } from 'lucide-react';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
});

const timelineItems = [
    {
        icon: GraduationCap,
        color: 'primary',
        title: 'B.Tech – Artificial Intelligence & Data Science',
        org: 'College of Engineering',
        period: '2023 – 2027',
        desc: 'Pursuing a B.Tech degree with focus on AI, Machine Learning, and Data Science concepts.',
    },
    {
        icon: Code2,
        color: 'accent',
        title: 'App Developer & Designer',
        org: 'Freelance',
        period: '2024 – Present',
        desc: 'Building modern web and mobile applications with focus on UI/UX design and performance.',
    },
    {
        icon: Briefcase,
        color: 'emerald',
        title: 'Portfolio Website Launch',
        org: 'Personal Project',
        period: '2025',
        desc: 'Developed and deployed a full-stack portfolio website to showcase projects and skills.',
    },
];

const colorMap = {
    primary: 'from-primary-500 to-primary-600 shadow-primary-500/30',
    accent: 'from-accent-500 to-accent-600 shadow-accent-500/30',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
};

const borderMap = {
    primary: 'border-primary-500/30',
    accent: 'border-accent-500/30',
    emerald: 'border-emerald-500/30',
};

const iconMap = {
    primary: 'text-primary-400',
    accent: 'text-accent-400',
    emerald: 'text-emerald-400',
};

export default function About() {
    return (
        <div className="pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <motion.div {...fadeUp()} className="text-center mb-20">
                    <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">Who I Am</span>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        About <span className="gradient-text">Me</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A passionate student and developer from India, building the future with code and creativity.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                    {/* Left – Avatar + Info */}
                    <motion.div {...fadeUp(0.1)} className="flex flex-col items-center lg:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-52 h-52 rounded-3xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center shadow-2xl shadow-primary-500/10 text-8xl">
                                👨‍💻
                            </div>
                            <div className="absolute -bottom-3 -right-3 glass rounded-xl px-3 py-2 border border-primary-500/30">
                                <div className="flex items-center gap-1.5 text-xs text-primary-400 font-medium">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    Available
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {[
                                { icon: MapPin, label: 'Location', value: 'Tamil Nadu, India', color: 'text-primary-400' },
                                { icon: GraduationCap, label: 'Degree', value: 'B.Tech AI & DS', color: 'text-accent-400' },
                                { icon: Mail, label: 'Email', value: 'deenarpk2006@gmail.com', color: 'text-emerald-400', small: true },
                                { icon: Phone, label: 'Phone', value: '+91 8610281626', color: 'text-amber-400' },
                            ].map(item => (
                                <div key={item.label} className="card flex items-center gap-3 py-3.5">
                                    <div className={`w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs">{item.label}</p>
                                        <p className={`text-white font-medium text-sm ${item.small ? 'text-xs' : ''}`}>{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="#"
                            onClick={e => e.preventDefault()}
                            className="btn-primary w-full sm:w-auto justify-center"
                        >
                            <Download className="w-4 h-4" />
                            Download Resume
                        </a>
                    </motion.div>

                    {/* Right – Bio */}
                    <motion.div {...fadeUp(0.2)} className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-4">
                                I'm <span className="gradient-text">P. Dinesh</span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-4">
                                I am DINESH.P, a B.Tech Artificial Intelligence and Data Science student.
                                I am an App Designer and App Developer passionate about building modern digital applications.
                            </p>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                My journey in technology started with a curiosity for how applications work and a passion for
                                creating intuitive user experiences. I specialize in front-end development with strong foundations
                                in HTML, JavaScript, and Python.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                I use modern tools like VS Code, GitHub, Vercel, Figma, and Canva to design, develop, and deploy
                                high-quality digital products. I'm constantly learning and exploring new technologies to stay ahead
                                in the ever-evolving tech landscape.
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {[
                                { label: 'Projects Built', value: '1+', icon: '🚀' },
                                { label: 'Technologies', value: '3+', icon: '⚡' },
                                { label: 'Tools Used', value: '6+', icon: '🛠' },
                                { label: 'Year Started', value: '2024', icon: '📅' },
                            ].map(item => (
                                <div key={item.label} className="card text-center py-5">
                                    <div className="text-3xl mb-2">{item.icon}</div>
                                    <div className="text-2xl font-bold gradient-text font-display">{item.value}</div>
                                    <div className="text-slate-400 text-sm mt-1">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Interests */}
                        <div className="card">
                            <div className="flex items-center gap-2 mb-3">
                                <Heart className="w-4 h-4 text-red-400" />
                                <h3 className="font-semibold text-white">Interests & Passions</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Artificial Intelligence', 'Web Development', 'UI/UX Design', 'Mobile Apps', 'Open Source', 'Machine Learning'].map(interest => (
                                    <span key={interest} className="badge badge-info">{interest}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Timeline */}
                <motion.div {...fadeUp(0.3)}>
                    <div className="text-center mb-12">
                        <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">My Journey</span>
                        <h2 className="text-3xl font-bold font-display">
                            Education & <span className="gradient-text">Experience</span>
                        </h2>
                    </div>

                    <div className="relative max-w-3xl mx-auto">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-transparent" />

                        <div className="space-y-8">
                            {timelineItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="flex gap-6 pl-2"
                                >
                                    {/* Icon */}
                                    <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[item.color]} shadow-lg flex items-center justify-center flex-shrink-0`}>
                                        <item.icon className="w-4 h-4 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className={`card flex-1 border ${borderMap[item.color]}`}>
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-white">{item.title}</h3>
                                            <span className={`badge ${item.color === 'primary' ? 'badge-info' : item.color === 'accent' ? 'badge bg-accent-500/20 text-accent-400 border border-accent-500/30' : 'badge-success'}`}>
                                                {item.period}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium mb-2 ${iconMap[item.color]}`}>{item.org}</p>
                                        <p className="text-slate-400 text-sm">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
