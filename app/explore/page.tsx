"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import { User } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ExplorePage() {
  const { users, toggleFollow, currentUser, isLoggedIn } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn === "false") {
      router.push("/login");
    }
    if (
      isLoggedIn === "loading" &&
      localStorage.getItem("instagram-store") === null
    ) {
      router.push("./login");
    }
  }, [isLoggedIn, router]);

  if (!currentUser) return null;

  const followings = users.filter((user: User) => {
    return user.followers.includes(currentUser?.username);
  });

  const doesFollow = (user: User) => {
    // if user is in current user's followings, return true

    if (user.followers.includes(currentUser?.username)) return true;
    // if user is in current user's followers, return false
    return false;
  };
  const handleFollow = (username: string) => {
    toggleFollow(username);
    console.log(currentUser);
    console.log(users.filter((user) => user.username === username));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Suggested for you</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 p-4">
            {users.map((user) => (
              <div
                key={user.username}
                className="flex flex-col items-center space-y-2 w-24"
              >
                <a className="cursor-pointer" href={`/users/${user.username}`}>
                  <div className="relative w-20 h-20">
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      className="rounded-full object-cover"
                      sizes="80px"
                      fill
                      priority
                    />
                  </div>
                  <p className="text-sm font-medium truncate w-full text-center">
                    {user.username}
                  </p>
                </a>
                <Button
                  variant={doesFollow(user) ? "outline" : "default"}
                  className="w-full"
                  onClick={() => handleFollow(user.username)}
                >
                  {doesFollow(user) ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Following</h2>
        <div className="space-y-4">
          {followings.map((user: User) => (
            <Card key={user.username} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    className="rounded-full object-cover"
                    sizes="48px"
                    fill
                    priority
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.username}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleFollow(user.username)}
                >
                  Following
                </Button>
              </div>
            </Card>
          ))}
          {followings.length === 0 && (
            <p className="text-center text-muted-foreground">
              You're not following anyone yet
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
