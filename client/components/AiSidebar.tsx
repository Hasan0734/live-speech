
import Link from "next/link";
import {

  Sparkles,

  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import UserProfile from "./UserProfile";
import { Button } from "./ui/button";
import SidebarContents from "./SidebarContents";

const AiSidebar = () => {

  return (
    <Sidebar
      variant="sidebar"
      className="border-r border-border bg-card text-card-foreground select-none"
    >
      <SidebarHeader className="h-14 px-4 flex flex-row items-center border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight leading-none text-foreground">
              OmniStudio AI
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContents />

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

          <Link href={"/upgrade"}>
            <Button className="w-full py-1.5 px-3  text-xs font-semibold rounded-lg shadow-sm transition-colors">
              Upgrade Plan
            </Button>
          </Link>
        </div>

        <div className="border-t p-2">
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AiSidebar;
