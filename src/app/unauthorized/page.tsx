import Link from "next/link";
import { ShieldOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950">
          <ShieldOff className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          You need to sign in to access this page. Please log in with your credentials.
        </p>
        <Link href="/login">
          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <LogIn className="mr-2 h-4 w-4" />
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
