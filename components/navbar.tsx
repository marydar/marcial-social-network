"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { User, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { currentUser, logout } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
    logout();
  };

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-2">
        <Link href="/" className="text-xl font-bold">
          Marcial
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {currentUser ? (
            <>
              <Link href="/explore">
                <Button variant="ghost" size="icon">
                  <Compass className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => handleLogout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}