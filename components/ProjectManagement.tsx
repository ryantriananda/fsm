
import React, { useState, useEffect } from 'react';
import { BarChart2, Users, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { Project } from '../types';
import { projectService } from '../services/supabaseService';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Project Management</h2>
            <p className="text-gray-500 text-sm mt-1">Track internal and external project progress.</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
            Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-64">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                            ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-amber-100 text-amber-800'}`}>
                            {project.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-900"><ArrowUpRight size={20}/></button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-500">Manager: {project.manager}</p>
                </div>

                <div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-2"><Users size={16}/> {project.teamSize} Members</span>
                        <span className="flex items-center gap-2"><Calendar size={16}/> {project.deadline}</span>
                    </div>
                    
                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-gray-900'}`} 
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManagement;
