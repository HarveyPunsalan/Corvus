const BASE_URL = 'http://localhost:3000';

// -- HELPER --
// If a JWT token is stored, it adds the Authorization header automatically
function getHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Generic request function - used by all the functions below
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: getHeaders(),
  });

  const data = await res.json();

  // If the response is not ok (4xx or 5xx), throw the error
  // so components can catch it and show an error message
  if (!res.ok) throw new Error(data.error || 'Something went wrong');

  return data as T;
}

// -- AUTH --
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { username: string; password: string }) =>
    request<{ access_token: string; token_type: string }>(
      '/auth/login', { method: 'POST', body: JSON.stringify(data) }
    ),
};

// -- USERS --
export const usersApi = {
  me: () => request<import('../types').User>('/users/me'),

  follow: (userId: number) =>
    request(`/users/${userId}/follow`, { method: 'POST' }),

  unfollow: (userId: number) =>
    request(`/users/${userId}/unfollow`, { method: 'DELETE' }),

  getFollowers: (userId: number) =>
    request<import('../types').User[]>(`/users/${userId}/followers`),

  getFollowing: (userId: number) =>
    request<import('../types').User[]>(`/users/${userId}/following`),
};

// -- POSTS --
export const postsApi = {
  getAll: (skip = 0, limit = 10) =>
    request<import('../types').Post[]>(`/posts?skip=${skip}&limit=${limit}`),

  getFeed: (skip = 0, limit = 20) =>
    request<import('../types').Post[]>(`/posts/feed?skip=${skip}&limit=${limit}`),

  getMyPosts: () =>
    request<import('../types').Post[]>('/posts/my-posts'),

  getById: (id: number) =>
    request<import('../types').Post>(`/posts/${id}`),

  create: (data: { title: string; content: string }) =>
    request<import('../types').Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: { title?: string; content?: string }) =>
    request<import('../types').Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    request(`/posts/${id}`, { method: 'DELETE' }),

  like: (id: number) =>
    request(`/posts/${id}/like`, { method: 'POST' }),

  unlike: (id: number) =>
    request(`/posts/${id}/unlike`, { method: 'DELETE' }),

  getLikes: (id: number) =>
    request<{ post_id: number; likes: number }>(`/posts/${id}/likes`),
};