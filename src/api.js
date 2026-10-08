// Dynamically match the browser's hostname so cookies always belong to the same site.
// Avoids the 127.0.0.1 vs localhost mismatch that causes SameSite cookie rejection.
const API_URL = `http://${window.location.hostname}:5000/api/v1`;

// We must include credentials so the browser sends the HttpOnly JWT cookie with every request
const fetchAPI = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // THIS is the magic for cookie-based auth
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      // Unauthorized: Clear user from local storage and reload to trigger login screen
      localStorage.removeItem('current_user');
      window.dispatchEvent(new Event('auth_error'));
    }
    throw new Error(data?.error || 'API Request Failed');
  }

  return data;
};

export const api = {
  login: (username, password) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username, password) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  getNotes: () => fetchAPI('/notes'),
  createNote: (note) => fetchAPI('/notes', { method: 'POST', body: JSON.stringify(note) }),
  updateNote: (id, updates) => fetchAPI(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteNote: (id) => fetchAPI(`/notes/${id}`, { method: 'DELETE' }),

  getKeys: () => fetchAPI('/apikeys'),
  generateKey: (name) => fetchAPI('/apikeys', { method: 'POST', body: JSON.stringify({ name }) }),
  revokeKey: (id) => fetchAPI(`/apikeys/${id}`, { method: 'DELETE' })
};
