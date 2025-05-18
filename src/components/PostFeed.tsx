import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  category: string;
  description: string;
  userEmail: string;
  createdAt: { seconds: number; nanoseconds: number };
  privacy?: 'public' | 'private';
  userId?: string;
}

function formatDate(timestamp: { seconds: number; nanoseconds: number }) {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
}

export default function PostFeed() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postList: Post[] = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Post))
        .filter(post =>
          post.privacy === 'public' || (post.privacy === 'private' && post.userId === currentUser.uid)
        );
      setPosts(postList);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  if (loading) {
    return <div className="text-center mt-8">Loading posts...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>
      {posts.length === 0 && <div className="text-center">No posts yet.</div>}
      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className="font-bold text-lg mb-1">{post.title}</div>
          <div className="text-sm text-gray-500 mb-2">Category: {post.category}</div>
          <div className="mb-2">{post.description}</div>
          <div className="text-xs text-gray-400">By: {post.userEmail}</div>
          <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
          <div className="text-xs text-gray-400">Privacy: {post.privacy ?? 'public'}</div>
        </div>
      ))}
    </div>
  );
} 