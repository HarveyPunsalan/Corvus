import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../lib/api';
import type { Post } from '../types';
import { PostCard } from '../components/ui/PostCard';

export function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    postsApi.getFeed()
      .then(setPosts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading feed...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Your Feed</h1>
        <p className="text-gray-400">Latest posts from people you follow</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🐦‍⬛</p>
          <p className="text-lg mb-2">Your feed is empty</p>
          <p className="text-sm mb-6">Follow some people to see their posts here</p>
          <Link to="/explore" className="text-teal-400 hover:underline">Explore posts →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}