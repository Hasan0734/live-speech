"use client";
import {
  Speech,
  MicVocal,
  Sparkles,
  Image as ImageIcon,
  History,
  Settings,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from 'next/link'
import { cn } from "@/lib/utils";

const SidebarContents = () => {
  const pathname = usePathname();

  const mainNavItems = [
    {
      id: "1",
      label: "Text to Speech",
      url: "/dashboard/voice-generation",
      icon: Speech,
    },
    {
      id: "2",
      label: "Transcribe Audio",
      url: "/dashboard/transcribe",
      icon: MicVocal,
    },
    {
      id: "3",
      label: "Generate Prompts",
      url: "/dashboard/prompt-generation",
      icon: Sparkles,
    },
    {
      id: "4",
      label: "Image Generator",
      url: "/dashboard/image-generator",
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
                    className={cn(
                      "h-9 px-2.5  rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold",
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-2.5">
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
                    <Link href={item.url} className="flex items-center gap-2.5">
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
  );
};

export default SidebarContents;
