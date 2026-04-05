import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../lib/api';
import { Button } from '../components/ui/Button';

export function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required');
      return;
    }
    setLoading(true);
    try {
      await postsApi.create({ title, content });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">New Post</h1>
        <p className="text-gray-400">Share your thoughts with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-gray-700 py-3 text-2xl text-white
            placeholder:text-gray-700 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            className="w-full bg-transparent border-b border-gray-700 py-3 text-gray-300 text-base
            placeholder:text-gray-700 focus:outline-none focus:border-teal-500
            transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  );
}