import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Cpu, Wrench } from 'lucide-react';

const skillCategories = [
    {
        title: 'Core Languages',
        icon: Code,
        color: 'primary',
        skills: [
            { name: 'HTML5', level: 90, icon: '🌐', desc: 'Semantic markup, accessibility, SEO' },
            { name: 'CSS3', level: 80, icon: '🎨', desc: 'Flexbox, Grid, animations, responsive' },
            { name: 'JavaScript', level: 80, icon: '⚡', desc: 'ES6+, DOM, async/await, APIs' },
            { name: 'Python', level: 75, icon: '🐍', desc: 'Data analysis, scripting, AI basics' },
        ],
    },
    {
        title: 'Frameworks & Libraries',
        icon: Cpu,
        color: 'accent',
        skills: [
            { name: 'React.js', level: 65, icon: '⚛️', desc: 'Components, hooks, state management' },
            { name: 'Tailwind CSS', level: 75, icon: '💨', desc: 'Utility-first CSS framework' },
            { name: 'Node.js', level: 55, icon: '🟢', desc: 'REST APIs, server-side JavaScript' },
            { name: 'Framer Motion', level: 60, icon: '🎭', desc: 'React animations and transitions' },
        ],
    },
    {
        title: 'Tools & Platforms',
        icon: Wrench,
        color: 'emerald',
        skills: [
            { name: 'VS Code', level: 90, icon: '💻', desc: 'Primary development environment' },
            { name: 'GitHub', level: 80, icon: '🐙', desc: 'Version control, collaboration' },
            { name: 'Figma', level: 70, icon: '🎨', desc: 'UI design, prototyping, wireframing' },
            { name: 'Vercel', level: 80, icon: '▲', desc: 'Deployment, hosting, CI/CD' },
        ],
    },
];

const colorMap = {
    primary: { grad: 'from-primary-500 to-primary-600', bar: 'from-primary-400 to-primary-600', text: 'text-primary-400', ring: 'ring-primary-500/30' },
    accent: { grad: 'from-accent-500 to-accent-600', bar: 'from-accent-400 to-accent-600', text: 'text-accent-400', ring: 'ring-accent-500/30' },
    emerald: { grad: 'from-emerald-500 to-emerald-600', bar: 'from-emerald-400 to-emerald-600', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
};

function SkillBar({ name, level, icon, desc, color, delay }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const c = colorMap[color];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            className="card group hover:ring-1 hover:ring-primary-500/20"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center text-lg shadow-md`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{name}</h3>
                        <span className={`text-sm font-bold ${c.text}`}>{level}%</span>
                    </div>
                    <p className="text-slate-500 text-xs">{desc}</p>
                </div>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
                    initial={{ width: 0 }}
                    animate={visible ? { width: `${level}%` } : { width: 0 }}
                    transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }}
                />
            </div>
        </motion.div>
    );
}

export default function Skills() {
    return (
        <div className="pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">What I Can Do</span>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        My <span className="gradient-text">Skills</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A comprehensive overview of my technical skills, tools, and technologies I work with.
                    </p>
                </motion.div>

                {/* Overall stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {[
                        { value: '4+', label: 'Languages', icon: Terminal, color: 'text-primary-400' },
                        { value: '4+', label: 'Frameworks', icon: Cpu, color: 'text-accent-400' },
                        { value: '6+', label: 'Tools', icon: Wrench, color: 'text-emerald-400' },
                        { value: '80%', label: 'Avg Proficiency', icon: Code, color: 'text-amber-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="card text-center py-6"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</div>
                            <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Skill Categories */}
                <div className="space-y-16">
                    {skillCategories.map((cat, ci) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: ci * 0.1, duration: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[cat.color].grad} flex items-center justify-center shadow-lg`}>
                                    <cat.icon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold font-display text-white">{cat.title}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cat.skills.map((skill, si) => (
                                    <SkillBar
                                        key={skill.name}
                                        {...skill}
                                        color={cat.color}
                                        delay={si * 0.05}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Learning section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-20 card border border-primary-500/20"
                >
                    <h3 className="text-xl font-bold font-display text-white mb-4">Currently Learning 📚</h3>
                    <div className="flex flex-wrap gap-3">
                        {['Machine Learning', 'Deep Learning', 'React Native', 'MongoDB', 'Express.js', 'TypeScript', 'Next.js'].map(tech => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
