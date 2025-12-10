import React from 'react';
import { Project } from '../types';
import { Download, Trash2, Calendar, User } from 'lucide-react';
import { deleteProject } from '../services/projectService';

interface ProjectListProps {
    projects: Project[];
    userId: string;
    onRefresh: () => void;
    onBack: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, userId, onRefresh, onBack }) => {

    const handleDelete = (projectId: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProject(userId, projectId);
            onRefresh();
        }
    };

    const handleDownload = (base64: string, mimeType: string, date: number) => {
        const link = document.createElement('a');
        link.href = `data:${mimeType};base64,${base64}`;
        link.download = `headshot-project-${date}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 animate-fade-in text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <User size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Projects Yet</h2>
                <p className="text-slate-500 mb-8">Generate your first headshot to save it here.</p>
                <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                    Create New Headshot
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full animate-fade-in pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">My Saved Projects</h2>
                    <p className="text-slate-500 mt-1">Manage your previous generations</p>
                </div>
                <button onClick={onBack} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">
                    Back to Creation
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {/* Image Preview */}
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                            <img
                                src={`data:${project.image.mimeType};base64,${project.image.base64}`}
                                alt="Project Result"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handleDownload(project.image.base64, project.image.mimeType, project.createdAt)}
                                    className="p-3 bg-white text-slate-900 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    title="Download"
                                >
                                    <Download size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-3 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                <Calendar size={12} />
                                {formatDate(project.createdAt)}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Vibe</span>
                                    <span className="font-semibold text-slate-900">{project.features.vibe}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Lighting</span>
                                    <span className="font-semibold text-slate-900">{project.features.lighting}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
