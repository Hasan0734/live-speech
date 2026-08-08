"use client"
import PromptGeneration from "@/components/PromptGeneration/PromptGeneration";
import { useEffect, useState } from "react";

const PromptGenerationPage = () => {


  return (
    <div className="relative  flex px-4 md:px-0 ">
      <PromptGeneration />
    </div>
  );
};

export default PromptGenerationPage;
