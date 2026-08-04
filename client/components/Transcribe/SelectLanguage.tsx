import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  {
    name: "English",
  },
  {
    name: "Hindi",
  },
  {
    name: "Arabic",
  },
  {
    name: "Chinese",
  },
  {
    name: "Spanish",
  },
  {
    name: "French",
  },
  {
    name: "German",
  },
  {
    name: "Portuguese",
  },
  {
    name: "Russian",
  },
  {
    name: "Japanese",
  },
  {
    name: "Korean",
  },
  {
    name: "Italian",
  },
  {
    name: "Turkish",
  },
  {
    name: "Urdu",
  },
  {
    name: "Bengali",
  },
  {
    name: "Punjabi",
  },
  {
    name: "Indonesian",
  },
  {
    name: "Malay",
  },
  {
    name: "Dutch",
  },
  {
    name: "Polish",
  },
  {
    name: "Swedish",
  },
  {
    name: "Persian",
  },
  {
    name: "Vietnamese",
  },
  {
    name: "Thai",
  },
];

const SelectLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  return (
    <Select
      value={selectedLanguage}
      onValueChange={(language) => setSelectedLanguage(language)}
    >
      <SelectTrigger className="h-12! w-full rounded-xl">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languages.map((language) => (
            <SelectItem value={language.name}>{language.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectLanguage;
