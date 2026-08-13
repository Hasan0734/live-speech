import ImagePlayground from "@/components/ImageGenerator/imagePlayground";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

const getProject = async (projectHash: string) => {
  const supabase = await createClient();
  const res = await supabase
    .from("image-project")
    .select("*")
    .eq("hash", projectHash)
    .single();

  if (res.success) {
    return res.data;
  }

  notFound();
};

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { projectId } = await params;
  const project = await getProject(projectId);

  return (
    <div className="relative  flex px-4 md:px-0 ">
      <ImagePlayground project={project} />
    </div>
  );
};

export default ProjectPage;
