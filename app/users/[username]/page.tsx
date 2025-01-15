"use client";

import { useState, useRef } from "react";
import { User, useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRouter as ghd } from "next/router";
import { useEffect } from "react";
import { Pencil, Trash2, ImagePlus, Camera } from "lucide-react";

export const dynamic = "force-dynamic"; 

export default function UserPage({ params }) {
  const { username } = params;
  const {
    isLoggedIn,
    users,
    createPost,
    deletePost,
    editPost,
    deleteAccount,
    updateProfile,
  } = useStore();

  const currentUser: User = users.find((user) => user.username === username);

  // const usernameCurr = useStore
  const router = useRouter();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [followings, setFollowings] = useState<User[]>([]);

  useEffect(() => {
    if (currentUser) {
      console.log("current user changed");
      let followings = users.filter((user: User) => {
        return user.followers.includes(currentUser?.username);
      });
      let followers = users.filter((user: User) => {
        return currentUser?.followers.includes(user.username);
      });
      setFollowers(followers);
      setFollowings(followings);
    }
  }, [currentUser, router, isLoggedIn]);
  const userPosts = currentUser.posts;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <Card className="p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <Image
              src={currentUser.avatar}
              alt={currentUser.username}
              className="rounded-full object-cover"
              sizes="128px"
              fill
              priority
            />
          </div>

          <h1 className="text-2xl font-bold">{currentUser.username}</h1>

          <div className="flex space-x-8">
            <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-center">
                  <div>
                    <p className="text-2xl font-bold">{followers.length}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Followers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {followers.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center space-x-4"
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          className="rounded-full object-cover"
                          sizes="40px"
                          fill
                        />
                      </div>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-center">
                  <div>
                    <p className="text-2xl font-bold">{followings.length}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {followings.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center space-x-4"
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          className="rounded-full object-cover"
                          sizes="40px"
                          fill
                        />
                      </div>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Posts</h2>
        {userPosts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <p className="flex-1">{post.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
