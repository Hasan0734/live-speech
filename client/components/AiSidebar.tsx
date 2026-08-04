"use client";

import Link from "next/link";
import {
  Speech,
  MicVocal,
  Sparkles,
  Image as ImageIcon,
  History,
  Settings,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import UserProfile from "./UserProfile";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const AiSidebar = () => {
  const pathname = usePathname();

  console.log(pathname);
  const mainNavItems = [
    {
      id: "1",
      label: "Text to Speech",
      url: "/text-to-speech",
      icon: Speech,
    },
    {
      id: "2",
      label: "Transcribe Audio",
      url: "/transcribe",
      icon: MicVocal,
    },
    {
      id: "3",
      label: "Generate Prompts",
      url: "/prompt-generation",
      icon: Sparkles,
    },
    {
      id: "4",
      label: "Image Generator",
      url: "/image-generator",
      icon: ImageIcon,
    },
  ];

  const secondaryNavItems = [
    {
      id: "5",
      label: "Activity History",
      url: "/dashboard/history",
      icon: History,
    },
    {
      id: "6",
      label: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar
      variant="sidebar"
      className="border-r border-border bg-card text-card-foreground select-none"
    >
      <SidebarHeader className="h-14 px-4 flex flex-row items-center border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-xs shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M88,48V16a8,8,0,0,1,16,0V48a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,128,56Zm32,0a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V48A8,8,0,0,0,160,56Zm92.8,46.4L224,124v60a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V124L3.2,102.4a8,8,0,0,1,9.6-12.8L32,104V80a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8v24l19.2-14.4a8,8,0,0,1,9.6,12.8ZM208,88H48v96a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16Z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight leading-none text-foreground">
              OmniStudio AI
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className=" py-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
            Generation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === pathname}
                      className="h-9 px-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2.5"
                      >
                        <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {secondaryNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === pathname}
                      className="h-9 px-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2.5"
                      >
                        <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0">
        <div className="rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="text-xs font-bold text-foreground">
                Pro Credits
              </span>
            </div>
            <span className="text-xs font-semibold text-foreground">84%</span>
          </div>

          <div className="w-full bg-accent h-1.5 rounded-full overflow-hidden mb-2.5">
            <div className="bg-primary h-full rounded-full w-[84%]" />
          </div>

          <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
            1,680 of 2,000 generations remaining this month.
          </p>

          <Button className="w-full py-1.5 px-3  text-xs font-semibold rounded-lg shadow-sm transition-colors">
            Upgrade Plan
          </Button>
        </div>

        <div className="border-t p-2">
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AiSidebar;
