import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Globe, Star, X, Save, FolderOpen, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY_FORM = {
    title: '', description: '', shortDescription: '', image: '',
    projectLink: '', githubLink: '', technologies: '', category: 'web',
    featured: false, isPublished: true, order: 0,
};

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects/admin');
            setProjects(data.projects || []);
        } catch {
            toast.error('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (project) => {
        setEditing(project._id);
        setForm({
            ...project,
            technologies: (project.technologies || []).join(', '),
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async () => {
        if (!form.title || !form.description) {
            toast.error('Title and description are required.');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
            };
            if (editing) {
                await api.put(`/projects/${editing}`, payload);
                toast.success('Project updated!');
            } else {
                await api.post('/projects', payload);
                toast.success('Project created!');
            }
            setShowModal(false);
            fetchProjects();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save project.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!confirm(`Delete "${title}"?`)) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success('Project deleted!');
            fetchProjects();
        } catch {
            toast.error('Failed to delete project.');
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
                    <h1 className="text-2xl font-bold font-display text-white">Project Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your portfolio projects</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </motion.div>

            {/* Projects Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="stats-card animate-pulse">
                            <div className="h-40 bg-slate-700/50 rounded-xl mb-4" />
                            <div className="h-4 bg-slate-700 rounded mb-2" />
                            <div className="h-3 bg-slate-700/50 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No projects yet. Add your first project!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="stats-card group"
                        >
                            {/* Preview */}
                            <div className="w-full h-36 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-slate-700/50 flex items-center justify-center mb-4 overflow-hidden">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Globe className="w-10 h-10 text-slate-600" />
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {project.featured && (
                                    <span className="flex items-center gap-1 text-xs text-amber-400">
                                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                                    </span>
                                )}
                                <span className={`badge ${project.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                    {project.isPublished ? 'Published' : 'Draft'}
                                </span>
                                <span className="badge badge-info capitalize">{project.category}</span>
                            </div>

                            <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                            <p className="text-slate-400 text-xs mb-3 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-1 mb-4">
                                {(project.technologies || []).slice(0, 3).map(t => (
                                    <span key={t} className="badge badge-info">{t}</span>
                                ))}
                                {(project.technologies || []).length > 3 && (
                                    <span className="badge badge-info">+{project.technologies.length - 3}</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                                {project.projectLink && (
                                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button onClick={() => openEdit(project)}
                                    className="flex-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2">
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button onClick={() => handleDelete(project._id, project.title)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed inset-x-4 top-8 bottom-8 max-w-2xl mx-auto z-50 overflow-hidden"
                        >
                            <div className="glass rounded-2xl border border-slate-700/50 h-full flex flex-col shadow-2xl">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                                    <h2 className="text-xl font-bold font-display text-white">
                                        {editing ? 'Edit Project' : 'Add New Project'}
                                    </h2>
                                    <button onClick={() => setShowModal(false)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                                            <input type="text" name="title" value={form.title} onChange={handleChange}
                                                placeholder="Project title" className="input-field" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                                            <textarea name="description" value={form.description} onChange={handleChange}
                                                rows={3} placeholder="Full description..." className="input-field resize-none" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
                                            <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange}
                                                placeholder="Brief summary (max 200 chars)" className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Live URL</label>
                                            <input type="url" name="projectLink" value={form.projectLink} onChange={handleChange}
                                                placeholder="https://..." className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                                            <input type="url" name="githubLink" value={form.githubLink} onChange={handleChange}
                                                placeholder="https://github.com/..." className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                                            <input type="url" name="image" value={form.image} onChange={handleChange}
                                                placeholder="https://..." className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                            <select name="category" value={form.category} onChange={handleChange} className="input-field">
                                                {['web', 'mobile', 'desktop', 'ai', 'other'].map(c => (
                                                    <option key={c} value={c} className="bg-slate-800 capitalize">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Technologies (comma separated)</label>
                                            <input type="text" name="technologies" value={form.technologies} onChange={handleChange}
                                                placeholder="HTML, CSS, JavaScript, React" className="input-field" />
                                        </div>
                                        <div className="sm:col-span-2 flex gap-6">
                                            {[
                                                { name: 'featured', label: 'Featured Project' },
                                                { name: 'isPublished', label: 'Published' },
                                            ].map(cb => (
                                                <label key={cb.name} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" name={cb.name} checked={form[cb.name]} onChange={handleChange}
                                                        className="w-4 h-4 rounded text-primary-500 accent-primary-500" />
                                                    <span className="text-sm text-slate-300">{cb.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex gap-3 p-6 border-t border-slate-700/50">
                                    <button onClick={() => setShowModal(false)}
                                        className="btn-secondary flex-1 justify-center">Cancel</button>
                                    <button onClick={handleSave} disabled={saving}
                                        className="btn-primary flex-1 justify-center disabled:opacity-60">
                                        {saving ? (
                                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                        ) : (
                                            <><Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
