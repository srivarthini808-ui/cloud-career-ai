import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileSearch, GitCompare, Map, MessagesSquare,
  FileText, Sparkles, User as UserIcon, Settings, LogOut, Moon, Sun,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Resume Analysis", url: "/dashboard/resume", icon: FileSearch },
  { title: "Job Match", url: "/dashboard/job-match", icon: GitCompare },
  { title: "Skill Gap", url: "/dashboard/skill-gap", icon: Sparkles },
  { title: "Career Roadmap", url: "/dashboard/roadmap", icon: Map },
  { title: "Interview Prep", url: "/dashboard/interview", icon: MessagesSquare },
  { title: "Cover Letters", url: "/dashboard/cover-letter", icon: FileText },
];

const bottom = [
  { title: "Profile", url: "/dashboard/profile", icon: UserIcon },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => pathname === p;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2">
          <div className="size-8 rounded-lg gradient-bg grid place-items-center text-white font-bold shrink-0">C</div>
          <span className="font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            CloudHire <span className="gradient-text">AI</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.title}>
                  <SidebarMenuButton asChild isActive={isActive(it.url)} tooltip={it.title}>
                    <Link to={it.url} className="flex items-center gap-2">
                      <it.icon className="size-4" />
                      <span>{it.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottom.map((it) => (
                <SidebarMenuItem key={it.title}>
                  <SidebarMenuButton asChild isActive={isActive(it.url)} tooltip={it.title}>
                    <Link to={it.url} className="flex items-center gap-2">
                      <it.icon className="size-4" />
                      <span>{it.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2 group-data-[collapsible=icon]:hidden">
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={toggle} className="flex-1">
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </Button>
            <Button size="sm" variant="outline" onClick={signOut} className="flex-1">
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
