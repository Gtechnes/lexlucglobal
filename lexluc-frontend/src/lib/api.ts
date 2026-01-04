import { AuthResponse, LoginCredentials, DashboardStats } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Simple in-memory cache for GET requests
 */
const cache = new Map<string, any>();

/**
 * In-flight request tracking to prevent duplicate requests
 */
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Retry logic with exponential backoff
 */
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper to add timeout to fetch requests
 */
function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 15000) {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Generic API request handler with caching, retry logic, and smart error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Check cache for GET requests
  const method = options.method || 'GET';
  const cacheKey = `${method}:${endpoint}`;
  
  // Return cached data for GET requests
  if (method === 'GET' && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // Prevent duplicate in-flight requests (request deduplication)
  if (method === 'GET' && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // Execute request with retry logic
  const requestPromise = executeWithRetry<T>(url, {
    ...options,
    headers,
  }, cacheKey, method);

  // Track in-flight GET requests
  if (method === 'GET') {
    inFlightRequests.set(cacheKey, requestPromise);
  }

  try {
    const data = await requestPromise;
    return data;
  } finally {
    // Clean up in-flight request tracking
    if (method === 'GET') {
      inFlightRequests.delete(cacheKey);
    }
  }
}

/**
 * Execute request with exponential backoff retry logic
 */
async function executeWithRetry<T>(
  url: string,
  options: RequestInit,
  cacheKey: string,
  method: string,
  retries: number = 3,
  backoffMs: number = 1000
): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, options, 15000);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      
      // Handle rate limiting with retry
      if (response.status === 429) {
        if (retries > 0) {
          // Check for Retry-After header from server
          const retryAfter = response.headers.get('Retry-After');
          let waitTime = backoffMs * Math.pow(2, 3 - retries);
          
          if (retryAfter) {
            // If Retry-After is a number, it's seconds
            if (!isNaN(parseInt(retryAfter))) {
              waitTime = parseInt(retryAfter) * 1000;
            } else {
              // If it's a date, calculate wait time
              const retryDate = new Date(retryAfter);
              waitTime = Math.max(1000, retryDate.getTime() - Date.now());
            }
          }
          
          console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
          await sleep(waitTime);
          return executeWithRetry<T>(url, options, cacheKey, method, retries - 1, backoffMs);
        } else {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
      }
      
      throw new Error(error.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache GET requests
    if (method === 'GET') {
      cache.set(cacheKey, data);
    }

    return data;
  } catch (err: any) {
    // Retry on network errors (not 429)
    if (retries > 0 && !err.message?.includes('Too many requests')) {
      const waitTime = backoffMs * Math.pow(2, 3 - retries);
      console.warn(`Request failed: ${err.message}. Retrying in ${waitTime}ms...`);
      await sleep(waitTime);
      return executeWithRetry<T>(url, options, cacheKey, method, retries - 1, backoffMs);
    }
    throw err;
  }
}

/**
 * Clear the request cache
 */
export function clearCache() {
  cache.clear();
}

/**
 * Authentication API
 */
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest('/auth/me', { method: 'GET' }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },
};

/**
 * Services API
 */
export const servicesAPI = {
  getAll: () => apiRequest('/services', { method: 'GET' }),

  getOne: (id: string) => apiRequest(`/services/${id}`, { method: 'GET' }),

  getBySlug: (slug: string) => apiRequest(`/services/slug/${slug}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/services/${id}`, { method: 'DELETE' }),
};

/**
 * Tours API
 */
export const toursAPI = {
  getAll: () => apiRequest('/tours', { method: 'GET' }),

  getOne: (id: string) => apiRequest(`/tours/${id}`, { method: 'GET' }),

  getBySlug: (slug: string) => apiRequest(`/tours/slug/${slug}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/tours', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/tours/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/tours/${id}`, { method: 'DELETE' }),
};

/**
 * Bookings API
 */
export const bookingsAPI = {
  getAll: () => apiRequest('/bookings', { method: 'GET' }),

  getOne: (id: string) => apiRequest(`/bookings/${id}`, { method: 'GET' }),

  getByReference: (referenceNo: string) =>
    apiRequest(`/bookings/reference/${referenceNo}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/bookings/${id}/status?status=${status}`, {
      method: 'PATCH',
    }),

  delete: (id: string) =>
    apiRequest(`/bookings/${id}`, { method: 'DELETE' }),
};

/**
 * Blog API
 */
export const blogAPI = {
  /**
   * Get published posts only (for public blog page)
   */
  getPublic: () => apiRequest('/blog/public', { method: 'GET' }),

  /**
   * Get all posts including drafts (for admin)
   */
  getAdmin: () => apiRequest('/blog/admin', { method: 'GET' }),

  /**
   * Deprecated: Use getPublic() or getAdmin() instead
   */
  getAll: () => apiRequest('/blog', { method: 'GET' }),

  getOne: (id: string) => apiRequest(`/blog/${id}`, { method: 'GET' }),

  getBySlug: (slug: string) => apiRequest(`/blog/slug/${slug}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/blog/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/blog/${id}`, { method: 'DELETE' }),
};

/**
 * Contacts API
 */
export const contactsAPI = {
  getAll: () => apiRequest('/contacts', { method: 'GET' }),

  getOne: (id: string) => apiRequest(`/contacts/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  markAsRead: (id: string) =>
    apiRequest(`/contacts/${id}/read`, { method: 'PATCH' }),

  respond: (id: string, response: string) =>
    apiRequest(`/contacts/${id}/respond`, {
      method: 'PATCH',
      body: JSON.stringify({ response }),
    }),

  delete: (id: string) =>
    apiRequest(`/contacts/${id}`, { method: 'DELETE' }),
};

/**
 * Users API
 */
export const usersAPI = {
  getAll: () => apiRequest('/users', { method: 'GET' }),

  getOne: (id: string) => apiRequest(`/users/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

/**
 * Admin API
 */
export const adminAPI = {
  getStats: (): Promise<DashboardStats> =>
    apiRequest<DashboardStats>('/admin/stats', { method: 'GET' }),
};
