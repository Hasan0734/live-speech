import Projects from "@/components/ImageGenerator/Projects";
import { createClient } from "@/utils/supabase/server";


const getProjects = async () => {
  const supabase = createClient();
  const res = (await supabase).from("image-project").select("*");
  return (await res)?.data || [];
};

const ImageGenerator = async () => {

  const projects = await getProjects();

  return (
    <div className="relative  flex px-4 md:px-0 ">
      <Projects projects={projects}/>
    </div>
  );
};

export default ImageGenerator;
