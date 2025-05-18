import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function CreatePost() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !category || !description) {
      setError('All fields are required.');
      return;
    }
    if (!currentUser) {
      setError('You must be logged in to create a post.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        category,
        description,
        privacy,
        createdAt: Timestamp.now(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
      });
      setTitle('');
      setCategory('');
      setDescription('');
      setPrivacy('public');
      setSuccess('Post created successfully!');
    } catch (err) {
      setError('Failed to create post.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Category</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Privacy</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={privacy}
          onChange={e => setPrivacy(e.target.value as 'public' | 'private')}
          disabled={loading}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Create Post'}
      </button>
    </form>
  );
} 