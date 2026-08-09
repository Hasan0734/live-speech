"use client";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/type";


interface ProjectCardProps {
  onRename?: () => void;
  onDelete?: () => void;
  project: Project;
}

const ProjectCard = ({ project, onRename, onDelete }: ProjectCardProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Link
      href={`/image-generator/${project.id}`}
      className="relative w-full aspect-square rounded-2xl p-4 flex flex-col justify-between overflow-hidden group/card bg-accent/20 border border-white/10 shadow-sm"
    >
      {project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-accent/30 via-accent/40 to-accent/50 group-hover/card:from-accent/40 group-hover/card:to-accent/60 transition-all duration-300" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-background/40 pointer-events-none" />

      <div className="flex items-center justify-between z-10">
        <Badge
          variant="secondary"
          className="backdrop-blur-md bg-background/40 border-white/10 text-xs"
        >
          {project.imageCount} {project.imageCount === 1 ? "image" : "images"}
        </Badge>

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className={`transition-opacity duration-200 backdrop-blur-md bg-background/60 hover:bg-background/80 text-foreground border border-white/10 shadow-sm ${
                dropdownOpen
                  ? "opacity-150 visible"
                  : "opacity-0 group-hover/card:opacity-100"
              }`}
              variant="secondary"
              size="icon-xs"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="backdrop-blur-xl bg-popover/90 border-white/10"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuItem
              onClick={onRename}
              className="gap-2 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              variant="destructive"
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="z-10">
        <p className="text-foreground text-xs font-medium leading-tight line-clamp-2 drop-shadow-md">
          {project.title}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
