import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminActivities } from "@/components/admin/AdminActivities";
import { AdminSettings } from "@/components/admin/AdminSettings";

type AdminView = "dashboard" | "activities" | "settings";

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<AdminView>("activities");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="hidden sm:block font-serif font-semibold text-lg text-foreground">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => setCurrentView("settings")}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block space-y-2">
            <Button
              variant={currentView === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentView("dashboard")}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentView === "activities" ? "secondary" : "ghost"}
              className={`w-full justify-start ${currentView === "activities" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setCurrentView("activities")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Activities
            </Button>
            <Button
              variant={currentView === "settings" ? "secondary" : "ghost"}
              className={`w-full justify-start ${currentView === "settings" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setCurrentView("settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="pt-4 mt-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {currentView === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    Dashboard
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Welcome to your admin panel.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-start gap-2"
                    onClick={() => setCurrentView("activities")}
                  >
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Manage Activities</p>
                      <p className="text-sm text-muted-foreground">
                        Add, edit, or remove activities
                      </p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-start gap-2"
                    onClick={() => setCurrentView("settings")}
                  >
                    <Settings className="w-8 h-8 text-secondary" />
                    <div className="text-left">
                      <p className="font-semibold">Site Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Update organization info
                      </p>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {currentView === "activities" && <AdminActivities />}
            {currentView === "settings" && <AdminSettings />}
          </main>
        </div>
      </div>
    </div>
  );
}
