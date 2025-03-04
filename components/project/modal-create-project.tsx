"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from 'lucide-react';
import { useSession } from "next-auth/react";

interface ProjectData {
  name: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  technologyStack: string;
  budget: number;
  teamMembers: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (projectData: ProjectData) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    clientName: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    technologyStack: "",
    budget: 0,
    teamMembers: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!projectData.name) {
      setError("Project name is required");
      return;
    }

    // Check if user is authenticated
    if (!session?.user) {
      setError("You must be logged in to create a project");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for submission
      const submissionData = {
        ...projectData,
        teamMembers: projectData.teamMembers 
          ? projectData.teamMembers.split(',').map(member => member.trim())
          : []
      };

      const response = await fetch('/api/projects/[id]', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const newProject = await response.json();
        
        // Reset form
        setProjectData({
          name: "",
          clientName: "",
          description: "",
          startDate: "",
          endDate: "",
          priority: "Medium",
          technologyStack: "",
          budget: 0,
          teamMembers: "",
        });

        // Close modal and redirect
        onClose();
        router.push('/projects');
      } else {
        // Handle error response
        const errorData = await response.json();
        setError(errorData.error || "Failed to create project");
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Client Name */}
          <div>
            <label htmlFor="clientName" className="block text-sm font-semibold mb-2">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={projectData.clientName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-2">
              Project Description
            </label>
            <textarea
              id="description"
              name="description"
              value={projectData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={projectData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold mb-2">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={projectData.endDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-semibold mb-2">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={projectData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Technology Stack */}
          <div>
            <label htmlFor="technologyStack" className="block text-sm font-semibold mb-2">
              Technology Stack
            </label>
            <input
              type="text"
              id="technologyStack"
              name="technologyStack"
              value={projectData.technologyStack}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-semibold mb-2">
              Budget
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={projectData.budget}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Team Members */}
          <div>
            <label htmlFor="teamMembers" className="block text-sm font-semibold mb-2">
              Team Members
            </label>
            <input
              type="text"
              id="teamMembers"
              name="teamMembers"
              value={projectData.teamMembers}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Add team members separated by commas"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isSubmitting}
            >
             {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;