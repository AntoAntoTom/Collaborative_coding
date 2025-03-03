"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProjectData {
  _id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  priority: "Low" | "Medium" | "High" | "Critical";
  technologyStack: string;
  budget: number;
  teamMembers: string[];
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: ProjectData;
  onUpdate?: (updatedProject: ProjectData) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  projectData,
  onUpdate,
}) => {
  console.log("Received projectData:", projectData);
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updatedProject, setUpdatedProject] =
    useState<ProjectData>(projectData);

  useEffect(() => {
    setUpdatedProject(projectData);
  }, [projectData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedProject((prevData) => ({
      ...prevData,
      [name]:
        name === "startDate" || name === "endDate" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectToSubmit = {
      ...updatedProject,
      startDate:
        updatedProject.startDate instanceof Date
          ? updatedProject.startDate.toISOString()
          : updatedProject.startDate,
      endDate:
        updatedProject.endDate instanceof Date
          ? updatedProject.endDate.toISOString()
          : updatedProject.endDate,
    };
    if (!updatedProject.name) {
      setError("Project name is required");
      return;
    }

    if (!session?.user) {
      setError("You must be logged in to edit a project");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${updatedProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectToSubmit),
      });

      // const responseText = await response.text();
      // console.error("Full response:", responseText);
      if (response.ok) {
        const updatedData = await response.json();

        onUpdate?.(updatedData);
        onClose();
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
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
          <h2 className="text-2xl font-bold">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={updatedProject.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Client Name
            </label>
            <input
              type="text"
              name="clientName"
              value={updatedProject.clientName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Project Description
            </label>
            <textarea
              name="description"
              value={updatedProject.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={
                  updatedProject.startDate instanceof Date
                    ? updatedProject.startDate.toISOString().split("T")[0]
                    : updatedProject.startDate
                }
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={
                  updatedProject.endDate instanceof Date
                    ? updatedProject.endDate.toISOString()
                    : updatedProject.endDate
                }
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Technology Stack
            </label>
            <input
              type="text"
              name="technologyStack"
              value={updatedProject.technologyStack}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
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
              {isSubmitting ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
