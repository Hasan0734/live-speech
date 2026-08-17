import AiSidebar from "@/components/AiSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AiSidebar />
      <SidebarInset>
        <main className="h-full relative">
          <nav className="py-3.5 h-14 border-b sticky top-0 z-10 bg-background px-3">
            <SidebarTrigger />
          </nav>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
