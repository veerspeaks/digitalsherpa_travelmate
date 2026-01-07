import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeedPost, Comment } from '@types';
import { storageService } from '@services/storageService';
import { STORAGE_KEYS } from '@utils/constants';
import { useAuth } from './AuthContext';

interface FeedContextType {
  posts: FeedPost[];
  loading: boolean;
  addPost: (content: string, imageUrl?: string, location?: string) => Promise<boolean>;
  likePost: (postId: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<boolean>;
  getPost: (id: string) => FeedPost | undefined;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await storageService.getItem<FeedPost[]>(
        STORAGE_KEYS.FEED_POSTS,
      ) || [];
      allPosts.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (
    content: string,
    imageUrl?: string,
    location?: string,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const allPosts = await storageService.getItem<FeedPost[]>(
        STORAGE_KEYS.FEED_POSTS,
      ) || [];
      const newPost: FeedPost = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        content,
        imageUrl,
        location,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };

      allPosts.unshift(newPost);
      await storageService.setItem(STORAGE_KEYS.FEED_POSTS, allPosts);
      setPosts(allPosts);
      return true;
    } catch (error) {
      console.error('Error adding post:', error);
      return false;
    }
  };

  const likePost = async (postId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const allPosts = await storageService.getItem<FeedPost[]>(
        STORAGE_KEYS.FEED_POSTS,
      ) || [];
      const postIndex = allPosts.findIndex(post => post.id === postId);

      if (postIndex === -1) return false;

      const post = allPosts[postIndex];
      const likeIndex = post.likes.indexOf(user.id);

      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(user.id);
      }

      await storageService.setItem(STORAGE_KEYS.FEED_POSTS, allPosts);
      setPosts(allPosts);
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  };

  const addComment = async (postId: string, content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const allPosts = await storageService.getItem<FeedPost[]>(
        STORAGE_KEYS.FEED_POSTS,
      ) || [];
      const postIndex = allPosts.findIndex(post => post.id === postId);

      if (postIndex === -1) return false;

      const newComment: Comment = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        content,
        createdAt: new Date().toISOString(),
      };

      allPosts[postIndex].comments.push(newComment);
      await storageService.setItem(STORAGE_KEYS.FEED_POSTS, allPosts);
      setPosts(allPosts);
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const getPost = (id: string): FeedPost | undefined => {
    return posts.find(post => post.id === id);
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        loading,
        addPost,
        likePost,
        addComment,
        getPost,
      }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = (): FeedContextType => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within FeedProvider');
  }
  return context;
};

