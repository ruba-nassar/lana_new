import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, Grid3X3, BookOpen, Flame } from "lucide-react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user || user.role !== "admin") return null;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/participants", label: "Users", icon: Users },
    { href: "/admin/bingo-cards", label: "Bingo Cards", icon: Grid3X3 },
    { href: "/admin/reflections", label: "Reflections", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
            <Flame className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="font-serif font-bold text-sm text-foreground leading-tight">Daily Bingo</p>
            <p className="text-[10px] text-muted-foreground">Admin panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 pb-4">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5 px-2 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">Admin</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-xl"
            onClick={logout}
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}

export function ParticipantLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  if (!user || user.role !== "participant") return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky warm frosted header */}
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border/50 shadow-sm shadow-border/30">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
              <Flame className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-serif font-bold text-sm text-foreground">Daily Bingo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground hidden sm:block">{user.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground rounded-xl"
              onClick={logout}
            >
              <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 md:px-6">{children}</main>
    </div>
  );
}
