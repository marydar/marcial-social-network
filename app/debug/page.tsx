"use client";

import { useStore } from "@/lib/store";
import { useEffect } from "react";
export default function DebugPage() {
  const { users, currentUser } = useStore();
  useEffect(() => {
    console.log(users);
    console.log(currentUser);
  }, [users, currentUser]);

  return (
    <div>
      <h1>Debug Page</h1>
      {currentUser && <p>Current User: {currentUser.username}</p>}
      <p>This page is for debugging purposes only.</p>  
      {users.map((user) => (
        <div key={user.username}>
          <h2>{user.username}</h2>
          <p>followers:{user.followers}</p>
          {/* <p>followings:{user.followings}</p> */}
          <hr/>
        </div>
      ))}
    </div>
  );
}
