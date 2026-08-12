"use client";

import { PlusIcon } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { nanoid } from "nanoid";
import { Project } from "@/lib/type";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

interface ProjectsProps {
  projects: Project[];
}

const Projects = ({ projects }: ProjectsProps) => {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(false);

  const createNewProject = async () => {
    if (!user) return;
    setLoading(true);

    const id = uuid();
    const hash = nanoid(10).toLowerCase();
    const formattedName = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());

    const now = new Date();
    const dateSlug = now.toISOString().replace(/[-:]/g, "").split(".")[0]; // e.g., "20260811T120751"
    const r2Folder = `projects/${hash}_${dateSlug}`;
    const nowIso = now.toISOString();

    const newProject = {
      id,
      hash,
      user_id: user.id,
      name: formattedName,
      r2_folder: r2Folder,
    };

    const { error: insertError, data } = await supabase
      .from("image-project")
      .insert([newProject])
      .select()
      .eq("id", id)
      .single();

    if (insertError) {
      toast.error(insertError.message);
      console.log("Error creatring project: ", insertError.message);
    }
    toast.success("Created new project.");
    router.push("/dashboard/image-generator/" + hash);
    setLoading(false);
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
          {isLoading ? (
            <div className="flex justify-center flex-col items-center gap-1 text-muted-foreground">
              <Spinner />
              <span className="text-sm">Creating project...</span>
            </div>
          ) : (
            <div className="flex justify-center flex-col items-center gap-1 text-muted-foreground group-hover:text-foreground">
              <PlusIcon size={20} />
              <span className="text-sm">New Project</span>
            </div>
          )}
        </div>
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
