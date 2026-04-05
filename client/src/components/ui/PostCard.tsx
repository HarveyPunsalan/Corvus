import { useState } from 'react';
import type { Post } from '../../types';
import { postsApi } from '../../lib/api';
import { Avatar } from './Avatar';

type PostCardProps = {
  post: Post;
  initialLikes?: number;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function PostCard({ post, initialLikes = 0 }: PostCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (loading) return;
    setLoading(true);
    try {
      if (liked) {
        await postsApi.unlike(post.id);
        setLikes(l => l - 1);
        setLiked(false);
      } else {
        await postsApi.like(post.id);
        setLikes(l => l + 1);
        setLiked(true);
      }
    } catch {
      // silently fail on like errors
    } finally {
      setLoading(false);
    }
  }

  const author = post.owner?.username ?? 'unknown';

  return (
    <div className="bg-[#13161f] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar username={author} size="sm" />
        <div>
          <p className="text-white font-medium text-sm">{author}</p>
          <p className="text-gray-500 text-xs">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Post content */}
      <h2 className="text-white font-semibold text-lg mb-2">{post.title}</h2>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.content}</p>

      {/* Like button */}
      <div className="mt-4">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-colors ${
            liked
              ? 'bg-teal-500/20 text-teal-400'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
}