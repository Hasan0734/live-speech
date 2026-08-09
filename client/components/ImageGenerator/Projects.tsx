"use client";

import { PlusIcon } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { useState } from "react";
import { nanoid } from "nanoid";
import { Project } from "@/lib/type";



const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const createNewProject = () => {
    const id = nanoid(10);

    const newProject = {
      id,
      title: "Aug 9, 2026, 10:10 AM",
      imageCount: 0,
      imageUrl: "/ai-image.jpg",
    };

    setProjects((prev) => [...prev, newProject]);
  };
  return (
    <div className="max-w-5xl mx-auto p-6 font-sans w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Image Projects
        </h1>
        <p className="text-sm text-muted-foreground">
          Each project keeps your generations organized.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          onClick={createNewProject}
          className="border-2 border-dashed rounded-2xl transition-all duration-200 group hover:border-gray-600 hover:bg-card flex items-center justify-center aspect-square"
        >
          <div className="flex justify-center flex-col items-center gap-1 text-muted-foreground group-hover:text-foreground">
            <PlusIcon size={20} />
            <span className="text-sm">New Project</span>
          </div>
        </div>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
