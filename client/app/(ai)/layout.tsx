import AiSidebar from "@/components/AiSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider >
      <AiSidebar />
      <SidebarInset>
        <main className="h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
