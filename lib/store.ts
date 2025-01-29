import { stat } from "node:fs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GraphMatrix } from "./graph";

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
  currentSuggestionsUsers: User[];
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  deleteAccount: () => void;
  toggleFollow: (userId: string) => void;
  createPost: (message: string, imageUrl?: string) => void;
  createPost2: (message: string) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, message: string) => void;
  updateProfile: (name: string, avatar?: string) => void;
  getSuggestions: () => void;
}

const getSuggestions = (set, get) => {
  let graph  = new GraphMatrix();
  // Add users to the graph
  let users = get().users;
  users.forEach((user) => {
    graph.addNode(user.username);
  });
  // Add edges between users
  users.forEach((user) => {
    user.followers.forEach((follower) => {
      graph.addEdge(follower, user.username);
    });
  // suggest users based on the graph
  let suggestedUsernames = graph.suggest(graph, get().currentUser.username);
  let suggestedUsers = suggestedUsernames.map((username) => get().users.find((u) => u.username === username));
  set({
    currentSuggestionsUsers: suggestedUsers,
  }); 
  });
};
const login = (set, get) => (username, password) => {
  //check if user exists and password is correct
  if (get().users.find((u) => u.username === username && u.password === password)) {
    set({
      isLoggedIn: "true",
      currentUser: get().users.find(
        (u) => u.username === username && u.password === password
      ),
      
    });
    get().getSuggestions();
    return true;
  } else {
    set({
      isLoggedIn: "false",
      currentUser: null,
      
    });
    return false;
  }
  
};
const signup = (set, get) => (username, password) => {
  //check if username is not used by any user in users
  if (!get().users.find((u) => u.username === username)){
    const newUser = {
      username,
      name: username,
      password,
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
      followers: [],
      followings: [],
      posts: [],
    };
    set({
      isLoggedIn: "true",
      currentUser: newUser,
      users: [...get().users, newUser],
    });
    get().getSuggestions();
    return true;
  }
  else{
    set({
      isLoggedIn: "false",
      currentUser: null,
      
    });
    return false;
  }
};

const logout = (set, get) => {
  set({
    isLoggedIn: "false",
    currentUser: null,
  });
};

const deleteAccount =  (set, get) => {
  set({
    isLoggedIn: "false",
    currentUser: null,
    users: get().users.filter((u) => u.username !== get().currentUser?.username)
   });
};

const toggleFollow =  (set, get) => (username: string) => {
  //if current user is following user with username remove current user from that users follwers list and remove that user from current users following list
  let tempFollowers = [];
  get().users.forEach((user) => {
    if (user.username === username) {
      tempFollowers = user.followers;
    }
  });
  //unfollow
  if (tempFollowers.includes(get().currentUser?.username)) {
    const from = get().currentUser.username;
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
    //follow
  } else {
    const from = get().currentUser.username;
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
  get().getSuggestions();
};

const createPost = (set, get) => (message, imageUrl) => {
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
};

const createPost2 = (set, get) => (message: string) => {
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
};

const deletePost = (set, get) => (postId) => {
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
};

const editPost = (set, get) => (postId, message) => {
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
};

const updateProfile = (set, get) => (name: string, avatar?: string) => {
  console.log("update [rofile name: ",name, " avatar: ", avatar);
  
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
};
const initialUsers =  [
  {
    username: "a",
    name: "A",
    password: "a",
    avatar:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    followers: [],
    followings: [],
    posts: [],
  },
  {
    username: "b",
    name: "B",
    password: "b",
    avatar:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    followers: [],
    followings: [],
    posts: [],
  },
  {
    username: "c",
    name: "C",
    password: "c",
    avatar:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    followers: [],
    followings: [],
    posts: [],
  },
  {
    username: "d",
    name: "D",
    password: "d",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
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
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
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
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    followers: [],
    followings: [],
    posts: [],
  },
];
export const useStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: "loading",
      currentUser: null,
      currentSuggestionsUsers: [],
      users : initialUsers,
      login: login(set, get),
      signup: signup(set, get),
      logout: () =>logout(set, get),
      deleteAccount: () => deleteAccount(set, get),
      toggleFollow: toggleFollow(set, get),
      createPost: createPost(set, get),
      createPost2: createPost2(set, get),
      deletePost: deletePost(set, get),
      editPost: editPost(set, get),
      updateProfile: updateProfile(set, get),
      getSuggestions: () => getSuggestions(set, get),
    }),
    {
      name: "instagram-store",
    }
  )
);
