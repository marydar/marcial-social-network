import { stat } from "node:fs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Graph, getSuggestions } from "./graph";

export interface Post {
  id: string;
  userId: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
}

export interface User {
  username: string | undefined;
  name: string | undefined;
  password: string;
  avatar: string;
  followings: string[] | undefined;
  followers: string[] | undefined;
  posts: Post[];
}

interface AuthStore {
  isLoggedIn: "true" | "false" | "loading";
  currentUser: User | null;
  users: User[];
  currentSuggestions: User[];
  usersGraph: Graph;
  login: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  logout: () => void;
  deleteAccount: () => void;
  toggleFollow: (userId: string) => void;
  createPost: (message: string, imageUrl?: string) => void;
  createPost2: (message: string) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, message: string) => void;
  updateProfile: (name: string, avatar?: string) => void;
  // getSuggestions: () => void;
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const useStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: "loading",
      currentUser: null,
      currentSuggestions: [],
      // usersGraph: new Graph(),

      users: [
        {
          username: "a",
          name: "A",
          password: "a",
          avatar:
            "https://images.unsplash.com/photo-1506801127834-3a3e1c1c1c1c?w=150&h=150&fit=crop",
          followers: [],
          followings: [],
          posts: [],
        },
        {
          username: "jane_smith",
          name: "Jane Smith",
          password: "password456",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
          followers: [],
          followings: [],
          posts: [],
        },
        {
          username: "michael_brown",
          name: "Michael Brown",
          password: "password789",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
          followers: [],
          followings: [],
          posts: [],
        },
        {
          username: "emily_jones",
          name: "Emily Jones",
          password: "password101",
          avatar:
            "https://images.unsplash.com/photo-1506801127834-3a3e1c1c1c1c?w=150&h=150&fit=crop",
          followers: [],
          followings: [],
          posts: [],
        },
        {
          username: "david_wilson",
          name: "David Wilson",
          password: "password202",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
          followers: [],
          followings: [],
          posts: [],
        },
        {
          username: "sarah_davis",
          name: "Sarah Davis",
          password: "password303",
          avatar:
            "https://images.unsplash.com/photo-1506801127834-3a3e1c1c1c1c?w=150&h=150&fit=crop",
          followers: [],
          followings: [],
          posts: [],
        },
      ],
      usersGraph: (() => {
        const graph = new Graph();
        const initialUsers = [
          {
            username: "a",
            name: "A",
            password: "a",
            avatar:
              "https://images.unsplash.com/photo-1506801127834-3a3e1c1c1c1c?w=150&h=150&fit=crop",
            followers: [],
            followings: [],
            posts: [],
          },
          {
            username: "jane_smith",
            name: "Jane Smith",
            password: "password456",
            avatar:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
            followers: [],
            followings: [],
            posts: [],
          },
          {
            username: "michael_brown",
            name: "Michael Brown",
            password: "password789",
            avatar:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
            followers: [],
            followings: [],
            posts: [],
          },
          {
            username: "emily_jones",
            name: "Emily Jones",
            password: "password101",
            avatar:
              "https://images.unsplash.com/photo-1506801127834-3a3e1c1c1c1c?w=150&h=150&fit=crop",
            followers: [],
            followings: [],
            posts: [],
          },
          {
            username: "david_wilson",
            name: "David Wilson",
            password: "password202",
            avatar:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
            followers: [],
            followings: [],
            posts: [],
          },
          {
            username: "sarah_davis",
            name: "Sarah Davis",
            password: "password303",
            avatar:
              "https://images.unsplash.com/photo-1506801127834-3a3e1c1c1c1c?w=150&h=150&fit=crop",
            followers: [],
            followings: [],
            posts: [],
          },
        ];

        initialUsers.forEach((user) => graph.addNode(user)); // Populate the graph
        return graph;
      })(),

      login: (username, password) => {
        set((state) => ({
          currentSuggestions: getSuggestions(state.usersGraph, username),
        }));
        console.log("suggs",get().currentSuggestions);
        
        set({
          isLoggedIn: "true",
          currentUser: get().users.find(
            (u) => u.username === username && u.password === password
          ),
        });
      },

      signup: (username, password) => {
        const newUser = {
          username,
          name: username,
          password,
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
          followers: [],
          followings: [],
          posts: [],
        };
        set((state) => {
          state.usersGraph.addNode(newUser);

          return {
            isLoggedIn: "true",
            users: [...get().users, newUser],
            currentUser: newUser,
          };
        });
        console.log("graph after add", get().usersGraph.nodes);

        // set({
        //   isLoggedIn: "true",
        //   users: [...get().users, newUser],
        //   currentUser: newUser,
        //   // addUserToGraph(newUser),
        // });
      },

      logout: () => {
        set({
          isLoggedIn: "false",
          currentUser: null,
        });
      },

      deleteAccount: () => {
        const temp = get().currentUser?.username;
        set((state) => {
          state.usersGraph.removeNode(temp);

          return {
            isLoggedIn: "false",
            currentUser: null,
            users: get().users.filter(
              (u) => u.username !== get().currentUser?.username
            ),
          };
        });
        console.log("graph after delete", get().usersGraph.nodes);

        // set({
        //   isLoggedIn: "false",
        //   currentUser: null,
        //   users: get().users.filter((u) => u.username !== get().currentUser?.username)
        //  });
      },

      toggleFollow: (username: string) => {
        //if current user is following user with username remove current user from that users follwers list and remove that user from current users following list
        let tempFollowers = [];
        get().users.forEach((user) => {
          if (user.username === username) {
            tempFollowers = user.followers;
          }
        });
        if (tempFollowers.includes(get().currentUser?.username)) {
          const from = get().currentUser.username;
          set((state) => {
            state.usersGraph.removeEdge(from, username);
            return {
            };
          });
          set({
            users: get().users.map((user) => {
              if (user.username === username) {
                return {
                  ...user,
                  followers: user.followers.filter(
                    (follower) => follower !== get().currentUser?.username
                  ),
                };
              }
              return user;
            }),
          });
        } else {
          const from = get().currentUser.username;
          set((state) => {
            state.usersGraph.addEdge(from, username);
            return {};
          });
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

      createPost: (message, imageUrl) => {
        const newPost: Post = {
          id: Date.now().toString(),
          userId: get().currentUser?.username,
          message,
          imageUrl,
          createdAt: new Date().toISOString(),
        };
        set({
          currentUser: {
            ...get().currentUser,
            posts: [newPost, ...get().currentUser.posts],
          },
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
      createPost2: (message: string) => {
        const post: Post = {
          id: Date.now().toString(),
          userId: get().currentUser?.username,
          message,
          createdAt: new Date().toISOString(),
          imageUrl: undefined,
        };
        set({
          currentUser: {
            ...get().currentUser,
            posts: [...get().currentUser.posts, post],
          },
        });
      },

      deletePost: (postId) => {
        set({
          currentUser: {
            ...get().currentUser,
            posts: get().currentUser.posts.filter((post) => post.id !== postId),
          },
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
          currentUser: {
            ...get().currentUser,
            posts: get().currentUser.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  message,
                };
              }
              return post;
            }),
          },
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

      updateProfile: (name: string, avatar?: string) => {
        const temp = get().currentUser.username;
        set({
          currentUser: { ...get().currentUser, name, avatar },
          users: get().users.map((user) => {
            if (user.username === temp) {
              return { ...user, name, avatar };
            }
            return user;
          }),
        });
      },
    }),
    {
      name: "instagram-store",
      partialize: (state) => {
        const { usersGraph, ...rest } = state;
        return rest;
      },
    }
    // {
    //   name: 'instagram-store',

    // }
  )
);
