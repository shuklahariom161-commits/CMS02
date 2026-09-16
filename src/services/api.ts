import { Club, EventItem, AchievementItem, HiringItem, FacultyPostItem, User, FacultyMember } from '../types';

const API_BASE = '/api';

export const api = {
  // Faculty Directory
  async getFaculty(department?: string, designation?: string, search?: string): Promise<{ success: boolean; data: FacultyMember[] }> {
    try {
      const params = new URLSearchParams();
      if (department && department !== 'All' && department !== 'All Departments') params.append('department', department);
      if (designation && designation !== 'All' && designation !== 'All Designations') params.append('designation', designation);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/faculty?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch faculty');
      return await res.json();
    } catch {
      return { success: false, data: [] };
    }
  },

  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(data: any): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMe(token: string): Promise<{ success: boolean; user?: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Health
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Clubs
  async getClubs(category?: string, search?: string): Promise<{ success: boolean; data: Club[] }> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/clubs?${params.toString()}`);
    return res.json();
  },

  async getClubById(id: string): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/clubs/${id}`);
    return res.json();
  },

  async updateClub(
    id: string,
    clubData: Partial<Club>,
    token: string
  ): Promise<{ success: boolean; data?: Club; message?: string }> {
    const res = await fetch(`${API_BASE}/clubs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clubData),
    });
    return res.json();
  },

  // Events
  async getEvents(category?: string, search?: string, clubId?: string): Promise<{ success: boolean; data: EventItem[] }> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (clubId) params.append('clubId', clubId);

    const res = await fetch(`${API_BASE}/events?${params.toString()}`);
    return res.json();
  },

  async createEvent(
    eventData: Partial<EventItem>,
    token: string
  ): Promise<{ success: boolean; data?: EventItem; message?: string }> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    return res.json();
  },

  async updateEvent(
    id: string,
    eventData: Partial<EventItem>,
    token: string
  ): Promise<{ success: boolean; data?: EventItem; message?: string }> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    return res.json();
  },

  async deleteEvent(id: string, token: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Hiring
  async getHiring(clubId?: string): Promise<{ success: boolean; data: HiringItem[] }> {
    const params = new URLSearchParams();
    if (clubId) params.append('clubId', clubId);
    const res = await fetch(`${API_BASE}/hiring?${params.toString()}`);
    return res.json();
  },

  async createHiring(
    hiringData: Partial<HiringItem>,
    token: string
  ): Promise<{ success: boolean; data?: HiringItem; message?: string }> {
    const res = await fetch(`${API_BASE}/hiring`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hiringData),
    });
    return res.json();
  },

  async updateHiring(
    id: string,
    hiringData: Partial<HiringItem>,
    token: string
  ): Promise<{ success: boolean; data?: HiringItem; message?: string }> {
    const res = await fetch(`${API_BASE}/hiring/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hiringData),
    });
    return res.json();
  },

  async deleteHiring(id: string, token: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/hiring/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Club Members
  async getClubMembers(clubId?: string): Promise<{ success: boolean; data: any[] }> {
    const params = new URLSearchParams();
    if (clubId) params.append('clubId', clubId);
    const res = await fetch(`${API_BASE}/club-members?${params.toString()}`);
    return res.json();
  },

  async addClubMember(
    data: any,
    token: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/club-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateClubMember(
    id: string,
    data: any,
    token: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/club-members/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async removeClubMember(id: string, token: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/club-members/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Faculty Posts
  async getFacultyPosts(search?: string): Promise<{ success: boolean; data: FacultyPostItem[] }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/faculty-posts?${params.toString()}`);
    return res.json();
  },

  async createFacultyPost(
    postData: Partial<FacultyPostItem>,
    token: string
  ): Promise<{ success: boolean; data?: FacultyPostItem; message?: string }> {
    const res = await fetch(`${API_BASE}/faculty-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    return res.json();
  },

  async updateFacultyPost(
    id: string,
    postData: Partial<FacultyPostItem>,
    token: string
  ): Promise<{ success: boolean; data?: FacultyPostItem; message?: string }> {
    const res = await fetch(`${API_BASE}/faculty-posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    return res.json();
  },

  async deleteFacultyPost(id: string, token: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/faculty-posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Achievements
  async getAchievements(category?: string): Promise<{ success: boolean; data: AchievementItem[] }> {
    const params = new URLSearchParams();
    if (category && category !== 'ALL') params.append('category', category);

    const res = await fetch(`${API_BASE}/achievements?${params.toString()}`);
    return res.json();
  },

  async createAchievement(
    achievementData: Partial<AchievementItem>,
    token: string
  ): Promise<{ success: boolean; data?: AchievementItem; message?: string }> {
    const res = await fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(achievementData),
    });
    return res.json();
  },

  async updateAchievement(
    id: string,
    data: Partial<AchievementItem>,
    token: string
  ): Promise<{ success: boolean; data?: AchievementItem; message?: string }> {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAchievement(id: string, token: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Comments
  async getAllComments(userId?: string): Promise<{ success: boolean; count: number; data: any[] }> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      const res = await fetch(`${API_BASE}/comments?${params.toString()}`);
      return await res.json();
    } catch {
      return { success: false, count: 0, data: [] };
    }
  },

  async getComments(postId: string): Promise<{ success: boolean; count: number; data: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/comments/${postId}`);
      return await res.json();
    } catch {
      return { success: false, count: 0, data: [] };
    }
  },

  async createComment(
    postId: string,
    content: string,
    token: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, content }),
    });
    return res.json();
  },

  async updateComment(
    id: string,
    data: any,
    token: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteComment(id: string, token: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Users
  async getUsers(role?: string, search?: string): Promise<{ success: boolean; count: number; data: User[] }> {
    try {
      const params = new URLSearchParams();
      if (role && role !== 'ALL') params.append('role', role);
      if (search) params.append('search', search);
      const res = await fetch(`${API_BASE}/users?${params.toString()}`);
      return await res.json();
    } catch {
      return { success: false, count: 0, data: [] };
    }
  },

  async getUserById(id: string): Promise<{ success: boolean; data?: User }> {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`);
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async updateUser(
    userId: string,
    data: Partial<User>,
    token: string
  ): Promise<{ success: boolean; data?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Like
  async toggleLike(postId: string, token: string): Promise<{ success: boolean; liked: boolean; totalLikes: number }> {
    const res = await fetch(`${API_BASE}/likes/${postId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  async getPostLikes(postId: string, token?: string): Promise<{ success: boolean; totalLikes: number; hasLiked: boolean }> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/likes/${postId}`, { headers });
    return res.json();
  },

  // Reset demo seed
  async resetSeed(): Promise<any> {
    const res = await fetch(`${API_BASE}/seed/reset`, { method: 'POST' });
    return res.json();
  },
};
