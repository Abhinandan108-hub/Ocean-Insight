/**
 * API Client Service
 * Handles all HTTP requests to the Ocean Insight backend
 * Manages authentication tokens and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class APIClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokens();
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Clear tokens from memory and localStorage
   */
  public clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Get current access token
   */
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get current user from localStorage
   */
  public getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Make HTTP request with error handling and token refresh
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle unauthorized - try to refresh token
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });
        return retryResponse.json();
      }
    }

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors,
      };
      throw error;
    }

    return data as T;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        this.saveTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Authentication Endpoints
   */

  /**
   * Register new user
   */
  async register(name: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    // include confirmPassword so backend validation passes
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      const { accessToken, refreshToken, user } = response.data;
      this.saveTokens(accessToken, refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse> {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  /**
   * Logout user (client-side only)
   */
  logout(): void {
    this.clearTokens();
  }

  /**
   * Resource Endpoints
   */

  /**
   * Get all resources with pagination
   */
  async getResources(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      gradeLevel?: string;
      subject?: string;
      type?: string;
      tags?: string[];
    }
  ): Promise<ApiResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters?.search) params.append('search', filters.search);
    if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.tags?.length) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }

    return this.request(`/resources?${params.toString()}`, {
      method: 'GET',
    });
  }

  /**
   * Search resources
   */
  async searchResources(query: string): Promise<ApiResponse> {
    return this.request(`/resources/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  }

  /**
   * Get single resource
   */
  async getResource(id: string): Promise<ApiResponse> {
    return this.request(`/resources/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create new resource (Admin/Educator only)
   */
  async createResource(resourceData: any): Promise<ApiResponse> {
    return this.request('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    });
  }

  /**
   * Update resource
   */
  async updateResource(id: string, resourceData: any): Promise<ApiResponse> {
    return this.request(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    });
  }

  /**
   * Delete resource
   */
  async deleteResource(id: string): Promise<ApiResponse> {
    return this.request(`/resources/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Collection Endpoints
   */

  /**
   * Get user's collections
   */
  async getCollections(): Promise<ApiResponse> {
    return this.request('/collections', {
      method: 'GET',
    });
  }

  /**
   * Create collection
   */
  async createCollection(title: string, description: string): Promise<ApiResponse> {
    return this.request('/collections', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  /**
   * Get collection details
   */
  async getCollection(id: string): Promise<ApiResponse> {
    return this.request(`/collections/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Update collection
   */
  async updateCollection(
    id: string,
    title: string,
    description: string
  ): Promise<ApiResponse> {
    return this.request(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    });
  }

  /**
   * Delete collection
   */
  async deleteCollection(id: string): Promise<ApiResponse> {
    return this.request(`/collections/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Add resource to collection
   */
  async addToCollection(collectionId: string, resourceId: string): Promise<ApiResponse> {
    return this.request(`/collections/${collectionId}/add`, {
      method: 'POST',
      body: JSON.stringify({ resourceId }),
    });
  }

  /**
   * Remove resource from collection
   */
  async removeFromCollection(
    collectionId: string,
    resourceId: string
  ): Promise<ApiResponse> {
    return this.request(`/collections/${collectionId}/remove`, {
      method: 'POST',
      body: JSON.stringify({ resourceId }),
    });
  }

  /**
   * Share collection via email
   */
  async shareCollection(
    collectionId: string,
    recipientEmail: string
  ): Promise<ApiResponse> {
    return this.request(`/collections/${collectionId}/share`, {
      method: 'POST',
      body: JSON.stringify({ recipientEmail }),
    });
  }

  /**
   * Event Endpoints
   */

  /**
   * Get all events
   */
  async getEvents(page: number = 1, limit: number = 10): Promise<ApiResponse> {
    return this.request(`/events?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single event
   */
  async getEvent(id: string): Promise<ApiResponse> {
    return this.request(`/events/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create event (Admin only)
   */
  async createEvent(eventData: any): Promise<ApiResponse> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Update event
   */
  async updateEvent(id: string, eventData: any): Promise<ApiResponse> {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Delete event
   */
  async deleteEvent(id: string): Promise<ApiResponse> {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Register for event
   */
  async registerForEvent(eventId: string): Promise<ApiResponse> {
    return this.request(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Unregister from event
   */
  async unregisterFromEvent(eventId: string): Promise<ApiResponse> {
    return this.request(`/events/${eventId}/unregister`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Admin Endpoints
   */

  /**
   * Get dashboard stats (Admin only)
   */
  async getDashboardStats(): Promise<ApiResponse> {
    return this.request('/admin/dashboard', {
      method: 'GET',
    });
  }

  /**
   * Get system logs (Admin only)
   */
  async getLogs(page: number = 1, limit: number = 50): Promise<ApiResponse> {
    return this.request(`/admin/logs?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Publish resource (Admin only)
   */
  async publishResource(resourceId: string): Promise<ApiResponse> {
    return this.request(`/admin/resources/${resourceId}/publish`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId: string, role: string): Promise<ApiResponse> {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

// Create and export singleton instance
export const apiClient = new APIClient(API_BASE_URL);
export type { ApiError, ApiResponse, AuthResponse };
