import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { postsApi, usersApi } from '../lib/api';
import type { Post, User } from '../types';
import { PostCard } from '../components/ui/PostCard';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      postsApi.getMyPosts(),
      usersApi.getFollowers(user.id),
      usersApi.getFollowing(user.id),
    ]).then(([p, followers, following]) => {
      setPosts(p);
      setFollowers(followers);
      setFollowing(following);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user || loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="max-w-2xl">
      {/* Profile card */}
      <div className="bg-[#13161f] border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar username={user.username} size="lg" />
            <div>
              <h1 className="text-xl font-bold text-white">{user.username}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost">Edit Profile</Button>
        </div>

        {/* Stats row */}
        <div className="flex gap-8">
          {[
            { label: 'Posts', value: posts.length },
            { label: 'Followers', value: followers.length },
            { label: 'Following', value: following.length },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-lg font-semibold text-white mb-4">Posts by {user.username}</h2>
      <div className="flex flex-col gap-4">
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}