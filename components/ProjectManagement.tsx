
import React from 'react';
import { BarChart2, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

const mockProjects: Project[] = [
  { id: 'P1', name: 'Office Expansion', manager_name: 'David Kim', progress_pct: 75, status: 'In Progress', deadline: '2023-12-01', team_size: 12 },
  { id: 'P2', name: 'Q4 Recruitment', manager_name: 'Sarah J', progress_pct: 30, status: 'On Hold', deadline: '2024-01-15', team_size: 4 },
  { id: 'P3', name: 'IT Infrastructure Upgrade', manager_name: 'Alex T', progress_pct: 100, status: 'Completed', deadline: '2023-10-15', team_size: 8 },
];

const ProjectManagement: React.FC = () => {
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
                    <p className="text-sm text-gray-500">Manager: {project.manager_name}</p>
                </div>

                <div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-2"><Users size={16}/> {project.team_size} Members</span>
                        <span className="flex items-center gap-2"><Calendar size={16}/> {project.deadline}</span>
                    </div>
                    
                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Progress</span>
                            <span>{project.progress_pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${project.progress_pct === 100 ? 'bg-emerald-500' : 'bg-gray-900'}`} 
                                style={{ width: `${project.progress_pct}%` }}
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
