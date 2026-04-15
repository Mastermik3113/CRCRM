"use client";

import { useEffect, useState } from "react";
import { User, Shield, Bell, Palette, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type TabId = "profile" | "security" | "notifications" | "appearance";

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
}

interface NotificationPrefs {
  insurance_expiring: boolean;
  registration_expiring: boolean;
  payment_received: boolean;
  rental_return_due: boolean;
  service_due: boolean;
}

const defaultProfile: ProfileData = { full_name: "", email: "", phone: "", company: "" };
const defaultPrefs: NotificationPrefs = {
  insurance_expiring: true,
  registration_expiring: true,
  payment_received: true,
  rental_return_due: true,
  service_due: true,
};

const PROFILE_KEY = "crcrm_profile";
const PREFS_KEY = "crcrm_notification_prefs";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);

  const [profileSaved, setProfileSaved] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Password change form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem(PROFILE_KEY);
      if (p) setProfile({ ...defaultProfile, ...JSON.parse(p) });
      const n = localStorage.getItem(PREFS_KEY);
      if (n) setPrefs({ ...defaultPrefs, ...JSON.parse(n) });
    } catch {
      // ignore
    }
  }, []);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const savePrefs = (next: NotificationPrefs) => {
    setPrefs(next);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const togglePref = (key: keyof NotificationPrefs) => {
    savePrefs({ ...prefs, [key]: !prefs[key] });
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPwd.length < 8) {
      setPwdMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "error", text: "New passwords don't match." });
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) {
        setPwdMsg({ type: "error", text: error.message });
        return;
      }
      setPwdMsg({ type: "success", text: "Password updated." });
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      setPwdMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Could not update password.",
      });
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <nav className="flex flex-row gap-1 lg:flex-col">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Panel */}
        <div>
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
                <CardDescription className="text-xs">
                  Your contact details. Stored locally in your browser.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        placeholder="Your name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Your company"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 555-5555"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {profileSaved && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <Check className="h-3.5 w-3.5" /> Saved
                      </span>
                    )}
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                    >
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription className="text-xs">
                  Updates your Supabase account password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={changePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current_pwd">Current Password</Label>
                    <Input
                      id="current_pwd"
                      type="password"
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_pwd">New Password</Label>
                    <Input
                      id="new_pwd"
                      type="password"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_pwd">Confirm New Password</Label>
                    <Input
                      id="confirm_pwd"
                      type="password"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  {pwdMsg && (
                    <p
                      className={cn(
                        "text-xs font-medium",
                        pwdMsg.type === "success" ? "text-emerald-600" : "text-destructive"
                      )}
                    >
                      {pwdMsg.text}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                  >
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription className="text-xs">
                  Which alerts show up in the bell menu and dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(
                  [
                    { key: "insurance_expiring", label: "Insurance expiring soon", desc: "30-day advance warning" },
                    { key: "registration_expiring", label: "Registration expiring soon", desc: "30-day advance warning" },
                    { key: "payment_received", label: "Payment received", desc: "When a rental payment is logged" },
                    { key: "rental_return_due", label: "Rental return due", desc: "Day before / day of return" },
                    { key: "service_due", label: "Service due", desc: "Next service date reached" },
                  ] as const
                ).map((item, i) => (
                  <div key={item.key}>
                    {i > 0 && <Separator className="mb-4" />}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={prefs[item.key]}
                        onClick={() => togglePref(item.key)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                          prefs[item.key] ? "bg-emerald-500" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                            prefs[item.key] ? "translate-x-5" : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                ))}
                {prefsSaved && (
                  <p className="flex items-center gap-1 pt-2 text-xs text-emerald-600">
                    <Check className="h-3.5 w-3.5" /> Preferences saved
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Appearance</CardTitle>
                <CardDescription className="text-xs">
                  Choose how the app looks on this device.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3 max-w-md">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className={cn(
                          "rounded-lg border p-3 text-sm font-medium capitalize transition-colors",
                          mounted && theme === t
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:bg-accent"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
