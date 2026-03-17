import axios from 'axios';

const STORAGE_KEY = 'pm_saas_auth';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export function getStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function storeAuth(payload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function registerUser(formData) {
  const { data } = await api.post('/auth/register', formData);
  return data;
}

export async function loginUser(formData) {
  const { data } = await api.post('/auth/login', formData);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get('/auth/users');
  return data;
}

export async function fetchDashboard() {
  const { data } = await api.get('/projects/dashboard');
  return data;
}

export async function fetchProjects() {
  const { data } = await api.get('/projects');
  return data;
}

export async function fetchProject(projectId) {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
}

export async function createProject(payload) {
  const { data } = await api.post('/projects', payload);
  return data;
}

export async function fetchProjectTasks(projectId) {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  return data;
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data;
}

export async function updateTaskStatus(taskId, status) {
  const { data } = await api.put(`/tasks/${taskId}/status`, { status });
  return data;
}

export default api;
