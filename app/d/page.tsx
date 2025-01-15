"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import { User } from "@/lib/store";
export default function Page() {
    const { currentUser, createPost, updateProfile} = useStore();
  return (
    <>
      <div className="text-2xl">username</div>
      {/* currentUser.username */}
      <div>{currentUser.username}</div>
      <div className="text-2xl">Posts</div>
      <ul>
        {currentUser.posts.map((post) => (
          <li key={post.id}>{post.message}</li>
        ))}
      </ul>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => 
        {
            createPost("test", "");
            console.log("hi");
            
        }
      }>
        Create Post 
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => 
        {
            updateProfile("new name", undefined);
            console.log("hi");
            
        }
      }>
        new username 
      </button>
    </>
  );
}
