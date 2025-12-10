import { Project, GeneratedImage, HeadshotFeatures } from '../types';

const STORAGE_KEY = 'pintarnya_cv_projects';

export const saveProject = (userId: string, image: GeneratedImage, features: HeadshotFeatures): Project => {
    const newProject: Project = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        userId,
        createdAt: Date.now(),
        image,
        features,
    };

    const existingProjects = getProjects(userId);
    const updatedProjects = [newProject, ...existingProjects];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    return newProject;
};

export const getProjects = (userId: string): Project[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
        const allProjects: Project[] = JSON.parse(stored);
        // Filter by user ID if we want multi-user support simulation on same browser
        return allProjects.filter(p => p.userId === userId);
    } catch (e) {
        console.error("Failed to parse projects", e);
        return [];
    }
};

export const deleteProject = (userId: string, projectId: string) => {
    const existingProjects = getProjects(userId); // Actually gets ALL projects if I used the filter... wait.
    // Ideally we read ALL, filter out the one to delete, then write back.

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
        const allProjects: Project[] = JSON.parse(stored);
        const updatedProjects = allProjects.filter(p => p.id !== projectId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    } catch (e) {
        console.error("Failed to delete project", e);
    }
};
