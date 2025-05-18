import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  category: string;
  description: string;
}

export default function MountRushmore() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'posts'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userPosts: Post[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(userPosts);
    });
    return unsubscribe;
  }, [currentUser]);

  function toggleSelect(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(pid => pid !== id);
      } else if (prev.length < 4) {
        return [...prev, id];
      } else {
        return prev;
      }
    });
  }

  const selectedPosts = posts.filter(post => selected.includes(post.id));

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Mount Rushmore</h2>
      <p className="mb-2 text-gray-600">Pick your top 4 favorite items from your posts:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {posts.map(post => (
          <button
            key={post.id}
            type="button"
            onClick={() => toggleSelect(post.id)}
            className={`border rounded p-3 text-left transition-all duration-150 ${selected.includes(post.id) ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'} ${selected.length === 4 && !selected.includes(post.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selected.length === 4 && !selected.includes(post.id)}
          >
            <div className="font-semibold">{post.title}</div>
            <div className="text-xs text-gray-500">{post.category}</div>
            <div className="text-sm mt-1">{post.description}</div>
            {selected.includes(post.id) && <div className="mt-2 text-indigo-600 font-bold">Selected</div>}
          </button>
        ))}
      </div>
      <h3 className="text-xl font-bold mb-2">Your Top 4</h3>
      <div className="grid grid-cols-2 gap-4">
        {selectedPosts.map((post, idx) => (
          <div key={post.id} className="border-2 border-indigo-600 rounded-lg p-4 bg-indigo-50 flex flex-col items-center">
            <div className="text-lg font-bold mb-1">#{idx + 1}: {post.title}</div>
            <div className="text-xs text-gray-500 mb-1">{post.category}</div>
            <div className="text-sm text-center">{post.description}</div>
          </div>
        ))}
        {Array.from({ length: 4 - selectedPosts.length }).map((_, idx) => (
          <div key={idx} className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-400">
            Empty
          </div>
        ))}
      </div>
    </div>
  );
} 