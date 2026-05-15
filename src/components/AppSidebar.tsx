import { Home, UtensilsCrossed, LayoutDashboard, MessageCircle, Shield, User, LogIn, Dumbbell, ShieldCheck, BookOpen } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Meal Plan", url: "/planner", icon: UtensilsCrossed },
  { title: "Diet Library", url: "/diets", icon: BookOpen },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Exercises", url: "/exercises", icon: Dumbbell },
  { title: "Alerts", url: "/alerts", icon: Shield },
  { title: "AI Chat", url: "/chat", icon: MessageCircle },
];

const accountItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Admin", url: "/admin", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl gradient-mint flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-extrabold text-lg text-foreground">SmartPlate</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-bold text-xs">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent rounded-xl"
                      activeClassName="bg-primary/10 text-primary font-bold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-bold text-xs">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent rounded-xl"
                      activeClassName="bg-primary/10 text-primary font-bold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-xs text-muted-foreground text-center font-medium">
            SmartPlate AI v1.0
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
