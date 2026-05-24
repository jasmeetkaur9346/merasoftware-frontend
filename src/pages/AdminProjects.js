import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import ProjectWorkspaceModal from '../components/admin/ProjectWorkspaceModal';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch(SummaryApi.adminProjects.url, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setProjects(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(SummaryApi.allDevelopers.url, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setDevelopers(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch developers');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch developers');
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  const refreshProject = async (projectId) => {
    try {
      const response = await fetch(SummaryApi.adminProjects.url, {
        credentials: 'include',
      });
      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || 'Failed to refresh project');
        return null;
      }

      const latestProjects = data.data || [];
      setProjects(latestProjects);
      const matchedProject = latestProjects.find((project) => project._id === projectId) || null;
      setSelectedProject(matchedProject);
      return matchedProject;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to refresh project');
      return null;
    }
  };

  const ProjectCard = ({ project }) => (
    <button
      type="button"
      onClick={() => setSelectedProject(project)}
      className="w-80 rounded-lg bg-white p-4 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium">{project.productId?.serviceName}</h3>
          <p className="text-sm text-gray-600">Client: {project.userId?.name}</p>
          <p className="text-sm text-gray-600">
            Ordered: {new Date(project.createdAt).toLocaleDateString()}
          </p>
          {project.assignedDeveloper && (
            <p className="text-sm text-blue-600">
              Developer: {typeof project.assignedDeveloper === 'object'
                ? project.assignedDeveloper.name
                : 'Assigned'}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(project.projectProgress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${Math.round(project.projectProgress)}%` }}
          />
        </div>
      </div>

      {project.messages && project.messages.length > 0 && (
        <div className="mt-4 border-t pt-3 text-sm text-gray-600">
          <p className="font-medium">Latest Update:</p>
          <p className="mt-1">{project.messages[project.messages.length - 1].message}</p>
        </div>
      )}
    </button>
  );

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-6 text-2xl font-semibold">Website Projects</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {selectedProject && (
        <ProjectWorkspaceModal
          project={selectedProject}
          developers={developers}
          onClose={() => setSelectedProject(null)}
          onProjectUpdated={refreshProject}
        />
      )}
    </div>
  );
};

export default AdminProjects;
