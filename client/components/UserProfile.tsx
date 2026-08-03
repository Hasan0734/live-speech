"use client";
import {
  Settings,
  CreditCard,
  LifeBuoy,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const UserProfile = () => {
  // Mock user details for the dropdown footer
  const user = {
    name: "Alex Morgan",
    email: "alex.morgan@developer.io",
    avatar: "/avatars/alex.png",
  };

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <button className=" w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8 rounded-md border border-border shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-md bg-muted text-muted-foreground text-xs font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate">
                {user.name}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0 ml-1 transition-transform group-hover:text-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 rounded-lg shadow-lg border border-border"
        align="end"
        side="top"
        sideOffset={8}
      >
        {/* User Email Header inside Dropdown */}
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-medium leading-none text-foreground">
              {user.name}
            </p>
            <p className="text-[11px] leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2 text-xs py-2"
          >
            <Link href="/dashboard/billing">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Billing & Plans</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2 text-xs py-2"
          >
            <Link href="/dashboard/settings">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2 text-xs py-2"
          >
            <Link href="/support">
              <LifeBuoy className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Support & Docs</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 text-xs py-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
          onClick={() => {
            // Handle sign-out logic here
            console.log("Signing out...");
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
