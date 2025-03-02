"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import CreateProjectModal from '../project/modal-create-project';  // Import the new modal

export default function Navbar() {
   const [isOpen, setIsOpen] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
   const pathname = usePathname();
   const { data: session } = useSession();

   const navLinks = useMemo(() => {
     return [
       { label: "Home", href: "/" },
       { label: "Projects", href: "/projects" },
       ...(session?.user
         ? [
             session.user.role === "admin"
               ? { 
                   label: "Create Project", 
                   href: "#",
                   onClick: () => setIsModalOpen(true)  // Add onClick to open modal
                 }
               : { label: "Join Project", href: "/projects/join" },
             { label: "Profile", href: "/profile" },
           ]
         : [{ label: "Login", href: "/login" }]
       ),
     ];
   }, [session]);

   const handleCreateProject = (projectData: any) => {
     // Implement your project creation logic here
     console.log('Creating project:', projectData);
     // You might want to call an API to create the project
   };

   return (
     <>
       <nav className="bg-white shadow-lg">
         {/* Your existing navbar code */}
         {navLinks.map((link) => (
           <Link
             key={link.href}
              href={link.href}
             onClick={link.onClick}  // Add onClick handler
             className={`...`}
           >
             {link.label}
           </Link>
         ))}
       </nav>

       <CreateProjectModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSubmit={handleCreateProject}
       />
     </>
   );
}