// ── Axios-like fetch wrapper ──────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken(): string | null {
  return localStorage.getItem('cvht_token') || localStorage.getItem('token')
}

interface RequestOptions {
  method?: string
  body?: unknown
  params?: Record<string, string>
}

async function request<T>(endpoint: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = opts
  let url = `${BASE_URL}${endpoint}`
  if (params) {
    const qs = new URLSearchParams(params).toString()
    url += `?${qs}`
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
  return data
}

// ── Auth ─────────────────────────────────────────────────
export const authApi = {
  login:          (email: string, password: string) =>
    request<{ token: string; user: unknown }>('/auth/login', { method: 'POST', body: { email, password } }),
  me:             () => request('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    request('/auth/change-password', { method: 'PUT', body: { currentPassword, newPassword } }),
}

// ── Students ─────────────────────────────────────────────
export const studentApi = {
  getAll:    (params?: Record<string, string>) => request<{ data: unknown[]; total: number }>('/students', { params }),
  getOne:    (id: string)                       => request(`/students/${id}`),
  create:    (body: unknown)                    => request('/students', { method: 'POST', body }),
  update:    (id: string, body: unknown)        => request(`/students/${id}`, { method: 'PUT', body }),
  remove:    (id: string)                       => request(`/students/${id}`, { method: 'DELETE' }),
  getGrades: (id: string)                       => request(`/students/${id}/grades`),
}

// ── Grades ───────────────────────────────────────────────
export const gradeApi = {
  getAll:      (params?: Record<string, string>) => request('/grades', { params }),
  create:      (body: unknown)                   => request('/grades', { method: 'POST', body }),
  update:      (id: string, body: unknown)       => request(`/grades/${id}`, { method: 'PUT', body }),
  bulkImport:  (grades: unknown[])               => request('/grades/bulk', { method: 'POST', body: { grades } }),
  getSummary:  (classId: string, semesterId: string) => request(`/grades/summary/${classId}/${semesterId}`),
}

// ── Forum ─────────────────────────────────────────────────
export const forumApi = {
  getPosts:   (classId: string, params?: Record<string, string>) => request(`/forum/${classId}`, { params }),
  createPost: (body: unknown)              => request('/forum', { method: 'POST', body }),
  toggleLike: (postId: string)             => request(`/forum/${postId}/like`, { method: 'PUT' }),
  addComment: (postId: string, content: string) =>
    request(`/forum/${postId}/comments`, { method: 'POST', body: { content } }),
  deletePost: (postId: string)             => request(`/forum/${postId}`, { method: 'DELETE' }),
}

// ── Messages ─────────────────────────────────────────────
export const messageApi = {
  getConversations: ()                          => request('/messages/conversations'),
  getMessages:      (partnerId: string, params?: Record<string, string>) =>
    request(`/messages/${partnerId}`, { params }),
  send:             (receiverId: string, content: string) =>
    request('/messages', { method: 'POST', body: { receiverId, content } }),
  getUnreadCount:   ()                          => request('/messages/unread-count'),
}

// ── Classes ───────────────────────────────────────────────
export const classApi = {
  getAll:    ()                                 => request('/classes'),
  create:    (body: unknown)                    => request('/classes', { method: 'POST', body }),
  getStats:  (id: string, semesterId?: string)  =>
    request(`/classes/${id}/stats`, { params: semesterId ? { semesterId } : undefined }),
}

// ── Notifications ─────────────────────────────────────────
export const notifApi = {
  getAll:      ()           => request('/notifications'),
  markAllRead: ()           => request('/notifications/read-all', { method: 'PUT' }),
  markRead:    (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
}

// ── Misc ─────────────────────────────────────────────────
export const semesterApi = {
  getAll: () => request('/semesters'),
}
export const subjectApi = {
  getAll: () => request('/subjects'),
}

// ── Database ─────────────────────────────────────────────
export const databaseApi = {
  importStudents:  (data: any[]) => request('/database/import/students',  { method: 'POST', body: { data } }),
  importGrades:    (data: any[]) => request('/database/import/grades',    { method: 'POST', body: { data } }),
  importSemesters: (data: any[]) => request('/database/import/semesters', { method: 'POST', body: { data } }),
  importSubjects:  (data: any[]) => request('/database/import/subjects',  { method: 'POST', body: { data } }),
}
