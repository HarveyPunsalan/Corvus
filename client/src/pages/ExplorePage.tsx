import { useState, useEffect } from 'react';
import { postsApi } from '../lib/api';
import type { Post } from '../types';
import { PostCard } from '../components/ui/PostCard';

export function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi.getAll(0, 50)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.content.toLowerCase().includes(search.toLowerCase()) ||
    (post.owner?.username.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Explore</h1>
        <p className="text-gray-400">Discover posts from the community</p>
      </div>

      <input
        type="text"
        placeholder="Search posts, authors, topics..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-[#1a1f2e] border border-gray-700 rounded-xl px-4 py-3 text-white
        placeholder:text-gray-600 focus:outline-none focus:border-teal-500 mb-6"
      />

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}