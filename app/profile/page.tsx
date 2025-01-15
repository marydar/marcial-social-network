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
import { useEffect } from "react";
import { Pencil, Trash2, ImagePlus, Camera } from "lucide-react";

export default function ProfilePage() {
  const { 
    isLoggedIn,
    users,
    currentUser,
    createPost,
    deletePost,
    editPost,
    deleteAccount,
    updateProfile
  } = useStore();
  
  // const usernameCurr = useStore
  const router = useRouter();
  const [newPost, setNewPost] = useState({ message: "", image: "" });
  const [editingPost, setEditingPost] = useState<{ id: string; message: string } | null>(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: currentUser?.name || "",
    avatar: currentUser?.avatar || ""
  });
  const [followers, setFollowers] = useState<User[]>([]);
  const [followings, setFollowings] = useState<User[]>([]);
  
  const postImageInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {
    if (isLoggedIn === "false") {
      router.push("/login");
    }
    if(isLoggedIn === "loading" && localStorage.getItem("instagram-store") === null ){
      router.push("./login")
    }
    if (currentUser){
      console.log("current user changed")
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

  if (!currentUser) {
    return null;
  }

  const handleCreatePost = () => {
    if (newPost.message.trim()) {
      createPost(newPost.message, newPost.image);
      setNewPost({ message: "", image: "" });
      if (postImageInputRef.current) {
        postImageInputRef.current.value = "";
      }
    }
  };

  const handleEditPost = () => {
    if (editingPost && editingPost.message.trim()) {
      editPost(editingPost.id, editingPost.message);
      setEditingPost(null);
    }
  };

  const handleUpdateProfile = () => {
    updateProfile(
      editProfileData.name,
      editProfileData.avatar
    );
    setShowEditProfile(false);
    setEditProfileData({ name: "", avatar: null });
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files![0]);
      setNewPost(prev => ({ ...prev, image: fileUrl }));
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files![0]);
      setEditProfileData(prev => ({ ...prev, avatar: fileUrl }));
    }
  };

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
          <p className="text-sm text-muted-foreground">{currentUser.name}</p>
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
                    <div key={user.username} className="flex items-center space-x-4">
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
                    <div key={user.username} className="flex items-center space-x-4">
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
          <div className="flex space-x-4">
            <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={editProfileData.name}
                      onChange={(e) => setEditProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter new username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profile Picture</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        ref={profileImageInputRef}
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => profileImageInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                      {editProfileData.avatar && (
                        <span className="text-sm text-muted-foreground">
                          {editProfileData.avatar.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  deleteAccount();
                  router.push("/login");
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={newPost.message}
            onChange={(e) => setNewPost(prev => ({ ...prev, message: e.target.value }))}
          />
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*"
              ref={postImageInputRef}
              onChange={handlePostImageChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => postImageInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            {newPost.imageFile && (
              <span className="text-sm text-muted-foreground">
                {newPost.imageFile.name}
              </span>
            )}
            <Button onClick={handleCreatePost}>Post</Button>
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
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPost({ id: post.id, message: post.message })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {post.imageUrl && (
                <div className="relative w-full h-96">
                  <Image
                    src={post.imageUrl}
                    alt="Post image"
                    className="rounded-lg object-cover"
                    fill
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editingPost?.message || ""}
              onChange={(e) =>
                setEditingPost(prev =>
                  prev ? { ...prev, message: e.target.value } : null
                )
              }
            />
            <Button onClick={handleEditPost}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}