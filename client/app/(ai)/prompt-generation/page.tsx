"use client"
import PromptGeneration from "@/components/PromptGeneration/PromptGeneration";
import { useEffect, useState } from "react";

const PromptGenerationPage = () => {


  return (
    <div className="relative xl:h-screen flex px-4 md:px-0">
      <PromptGeneration />
    </div>
  );
};

export default PromptGenerationPage;
