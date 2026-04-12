import { Settings, User, Shield, Bell, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const settingsSections = [
  { title: "Profile", description: "Manage your account information", icon: User },
  { title: "Security", description: "Password and authentication settings", icon: Shield },
  { title: "Notifications", description: "Configure alert preferences", icon: Bell },
  { title: "Appearance", description: "Theme and display settings", icon: Palette },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="card-hover cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <CardDescription className="text-xs">{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
