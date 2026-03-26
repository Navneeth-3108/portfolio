export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
export const ASSET_BASE_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

/**
 * Generic fetch wrapper to handle errors consistently
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  // Attempt to parse JSON response
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }

  return data;
}

export const apiService = {
  getPersonalDetails: async () => {
    return fetchAPI('/personal-details');
  },

  getProjects: async (page = 1, limit = 10, techStack = '') => {
    let url = `/projects?page=${page}&limit=${limit}`;
    if (techStack) url += `&techStack=${encodeURIComponent(techStack)}`;
    return fetchAPI(url);
  },
  
  getSkills: async () => {
    return fetchAPI('/skills');
  },
  
  getExperience: async () => {
    return fetchAPI('/experience');
  },
  
  getEducation: async () => {
    return fetchAPI('/education');
  },

  submitMessage: async (messageData) => {
    return fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  login: async (username, password) => {
    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res?.data?.token) {
      localStorage.setItem('adminToken', res.data.token);
    }
    return res;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
  },

  updatePersonalDetails: async (data) => {
    return fetchAPI('/personal-details', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  createProject: async (data) => {
    return fetchAPI('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProject: async (id, data) => {
    return fetchAPI(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProject: async (id) => {
    return fetchAPI(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  createSkill: async (data) => {
    return fetchAPI('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateSkill: async (id, data) => {
    return fetchAPI(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteSkill: async (id) => {
    return fetchAPI(`/skills/${id}`, {
      method: 'DELETE',
    });
  },

  createExperience: async (data) => {
    return fetchAPI('/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateExperience: async (id, data) => {
    return fetchAPI(`/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteExperience: async (id) => {
    return fetchAPI(`/experience/${id}`, {
      method: 'DELETE',
    });
  },

  createEducation: async (data) => {
    return fetchAPI('/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEducation: async (id, data) => {
    return fetchAPI(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteEducation: async (id) => {
    return fetchAPI(`/education/${id}`, {
      method: 'DELETE',
    });
  },

  getMessages: async () => {
    return fetchAPI('/messages');
  },

  deleteMessage: async (id) => {
    return fetchAPI(`/messages/${id}`, {
      method: 'DELETE',
    });
  },


  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    // We don't use fetchAPI here because it sets Content-Type to application/json
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data;
  }
};



