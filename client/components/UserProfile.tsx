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
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const UserProfile = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const fullName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = user.user_metadata?.avatar_url;

  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Server action to handle sign out securely
  const signOutAction = async () => {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    redirect("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8 rounded-md border border-border shrink-0">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
              <AvatarFallback className="rounded-md bg-muted text-muted-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate">
                {fullName}
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
              {fullName}
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

        {/* Use a form with Server Action for secure sign out */}
        <form action={signOutAction}>
          <button type="submit" className="w-full">
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs py-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 w-full">
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
