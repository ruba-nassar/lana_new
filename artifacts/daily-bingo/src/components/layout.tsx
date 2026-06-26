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
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">Daily Bingo</span>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 pb-4">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="px-3 py-1.5 mb-1">
            <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent"
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
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-serif text-base font-bold tracking-tight">Daily Bingo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground hidden sm:block">
              {user.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
              onClick={logout}
            >
              <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
