import { stat } from 'node:fs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Post {
  id: string;
  userId: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
}

export interface User {
  username: string|undefined;
  password: string
  avatar: string;
  // isFollowing: boolean;
  followings: string[]|undefined;
  followers: string[]|undefined;
  posts: Post[];
}

interface AuthStore {
  isLoggedIn: "true" | "false" | "loading";
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  logout: () => void;
  deleteAccount: () => void;
  toggleFollow: (userId: string) => void;
  createPost: (message: string, imageUrl?: string) => void;
  createPost2: (message: string) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, message: string) => void;
  updateProfile: (newusername: string, avatar?: string) => void;
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const useStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: "loading",
      currentUser: null,

      users: [
        {
          username: 'a',
          password: 'a',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
          followers: [],
          followings: [],
          posts: [],  
        },
        {
          username: 'b',
          password: 'b',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
          followers: [],
          followings: [],
          posts: [],  
        },
        {
          username: 'c',
          password: 'c',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
          followers: [],
          followings: [],
          posts: [],  
        },
      
      ],

      login: (username, password) => {
        set({ 
          isLoggedIn: "true",
          currentUser: get().users.find((u) => u.username === username && u.password === password),
        });
      },

      signup: (username, password) => {
        const newUser = {
          username,
          password,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
          followers: [],
          followings: [],
          posts: [],
        };
        set({ 
          isLoggedIn: "true",
          users: [...get().users, newUser],
          currentUser: newUser,
        });
      },

      logout: () => {
        set({ 
          isLoggedIn: "false",
          currentUser: null,
         });
      },

      deleteAccount: () => {
        set({ 
          isLoggedIn: "false",
          currentUser: null,
          users: get().users.filter((u) => u.username !== get().currentUser?.username)
         });
      },

      toggleFollow: (username : string) => {
        //if current user is following user with username remove current user from that users follwers list and remove that user from current users following list
        let tempFollowers = []
        get().users.forEach((user) => {
          if (user.username === username) {
            tempFollowers = user.followers
          }
        })
        if (tempFollowers.includes(get().currentUser?.username)) {
          set({
            users: get().users.map((user) => {
              if (user.username === username) {
                return {
                  ...user,
                  followers: user.followers.filter((follower) => follower !== get().currentUser?.username),
                };
              }
              return user;
            }),
          });
        } else {
          //if current user is not following user with username add current user to that users followers list and add that user to current users following list
          set({
            users: get().users.map((user) => {
              if (user.username === username) {
                return {
                  ...user,
                  followers: [...user.followers, get().currentUser?.username],
                };
              }
              return user;
            }),
          });
        }
      },

      createPost:  (message, imageUrl) => {
        const newPost:Post = {
          id: Date.now().toString(),
          userId: get().currentUser?.username,
          message,
          imageUrl,
          createdAt: new Date().toISOString(),
        };
        set({
          currentUser: { ...get().currentUser, posts: [newPost, ...get().currentUser.posts]},
          users: get().users.map((user) => {
            if (user.username === get().currentUser?.username) {
              return {
                ...user,
                posts: [newPost, ...user.posts],
              };
            }
            return user;
          }),
        });
      },
      createPost2:(message: string)=> {
        const post:Post = {
          id: Date.now().toString(),
          userId: get().currentUser?.username,
          message,
          createdAt: new Date().toISOString(),
          imageUrl: undefined,
        };
        set({
          currentUser: { ...get().currentUser, posts: [...get().currentUser.posts, post]}
        })},

      deletePost: (postId) => {
        set({
          currentUser: { ...get().currentUser, posts: get().currentUser.posts.filter((post) => post.id !== postId)},
          users: get().users.map((user) => {
            if (user.username === get().currentUser?.username) {
              return {
                ...user,
                posts: user.posts.filter((post) => post.id !== postId),
              };
            }
            return user;
          }),
        });
      },

      editPost: (postId, message) => {
        set({
          currentUser: { ...get().currentUser, posts: get().currentUser.posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                message,
              };
            }
            return post;
          })},
          users: get().users.map((user) => {
            if (user.posts.find((post) => post.id === postId)) {
              return {
                ...user,
                posts: user.posts.map((post) => {
                  if (post.id === postId) {
                    return {
                      ...post,
                      message,
                    };
                  }
                  return post;
                }),
              };
            }
            return user;
          }),
        });
      },

      updateProfile:(username: string, avatar?: string) => {
        const temp =  get().currentUser.username
        set({
          currentUser: { ...get().currentUser, username, avatar},
          users: get().users.map((user) => {
            if (user.username === temp) {
              return { ...user, username, avatar };
            }
            return user;
          }),
        })
      },
    }),
    {
      name: 'instagram-store',
    }
  )
);