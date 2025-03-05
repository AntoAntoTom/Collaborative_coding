import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Edit, UserPlus } from "lucide-react"; // Import icons for buttons
import EditProjectModal from "./EditProjectModal";
import Project from "@/models/project.model";
import { useState } from "react";

interface Project {
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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
}



interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };
  const handleJoin = () => {
    router.push(`/projects/join?id=${project._id}`);
  };

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold">{project.name}</h2>
      <p className="text-gray-600">{project.description}</p>

      <div className="flex items-center gap-4 mt-2">
        <span className="text-sm">
          <strong>Priority:</strong>{" "}
          <span
            className={`
            px-2 py-1 rounded-full text-xs
            ${project.priority === "Critical" ? "bg-red-100 text-red-800" : ""}
            ${
              project.priority === "High" ? "bg-orange-100 text-orange-800" : ""
            }
            ${
              project.priority === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : ""
            }
            ${project.priority === "Low" ? "bg-green-100 text-green-800" : ""}
          `}
          >
            {project.priority}
          </span>
        </span>

        <span className="text-sm">
          <strong>Status:</strong>{" "}
          <span
            className={`
            px-2 py-1 rounded-full text-xs
            ${
              project.status === "Planning"
                ? "bg-purple-100 text-purple-800"
                : ""
            }
            ${
              project.status === "In Progress"
                ? "bg-blue-100 text-blue-800"
                : ""
            }
            ${
              project.status === "Completed"
                ? "bg-green-100 text-green-800"
                : ""
            }
            ${project.status === "On Hold" ? "bg-gray-100 text-gray-800" : ""}
          `}
          >
            {project.status}
          </span>
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        {isAdmin ? (
          <div className="grid-rows-subgrid">
            {" "}
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </button>
            <button
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              onClick={handleJoin}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Join Project
            </button>
          </div>
        ) : (
          <button
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            onClick={handleJoin}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Join Project
          </button>
        )}
      </div>
            {/* Edit Project Modal */}
            {isEditModalOpen && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          projectData={project} // Pass current project data
        />
      )}
    </div>
  );
}
