// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import LoadingSpinner from "@/components/loading_indicator"; // Your loading component
// import ProjectCard from "./ProjectCard";

// interface Project {
//   _id: string;
//   name: string;
//   description: string;
//   priority: "Low" | "Medium" | "High" | "Critical";
//   status: "Planning" | "In Progress" | "Completed" | "On Hold";
// }

// const ProjectListPage = () => {
//   const { data: session, status } = useSession();
//   const [projects, setProjects] = useState<Project[]>([]); // Explicitly typed as an array of Project objects
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === "authenticated") {
//       // Fetch projects for the authenticated user
//       fetch("/api/projects")
//         .then((res) => res.json())
//         .then((data) => {
//           setProjects(data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error fetching projects:", err);
//           setLoading(false);
//         });
//     }
//   }, [status]);

//   if (status === "loading" || loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (projects.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-500">No projects found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Projects</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {projects.map((project) => (
//           <ProjectCard   project={project} />
//         ))}
//       </div>
//     </div>
//   );
// };

