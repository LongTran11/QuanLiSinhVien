import { create } from 'zustand'
import type { Student, ForumPost, Conversation, Notification, Class, Semester, GradeEntry, StudentGradeSummary, StudentStatus } from '../types'
import { classApi, semesterApi, studentApi } from '../lib/api'
import {
  forumPosts as initPosts,
  conversations as initConvs,
  notifications as initNotifs,
  gradeEntries as initGrades,
  gradeSummaries as initSummaries,
} from '../lib/mockData'

// ── App Store ──────────────────────────────────────────────
interface AppState {
  currentClassId: string
  setCurrentClassId: (id: string) => void
  classes: Class[]
  fetchClasses: () => Promise<void>
  addClass: (name: string) => void
  semesters: Semester[]
  fetchSemesters: () => Promise<void>
  currentSemesterId: string
  setCurrentSemesterId: (id: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentClassId: 'K23-CNTT-01',
  setCurrentClassId: (id) => set({ currentClassId: id }),
  classes: [],
  fetchClasses: async () => {
    try {
      const res = await classApi.getAll() as any
      const classes = res.data || res
      set({ classes })
      if (classes.length > 0 && !get().currentClassId) {
        set({ currentClassId: classes[0].name })
      }
    } catch (err) { console.error('Fetch classes error', err) }
  },
  addClass: async (name) => {
    try {
      await classApi.create({ name, year: new Date().getFullYear() })
      get().fetchClasses()
    } catch (err) { console.error('Add class error', err) }
  },
  semesters: [],
  fetchSemesters: async () => {
    try {
      const res = await semesterApi.getAll() as any
      const semesters = res.data || res
      set({ semesters })
      if (semesters.length > 0 && !get().currentSemesterId) {
        set({ currentSemesterId: semesters[0].semesterId })
      }
    } catch (err) { console.error('Fetch semesters error', err) }
  },
  currentSemesterId: '',
  setCurrentSemesterId: (id) => set({ currentSemesterId: id }),
}))

// ── Student Store ──────────────────────────────────────────
interface StudentState {
  students: Student[]
  total: number
  fetchStudents: (params?: Record<string, string>) => Promise<void>
  addStudent: (data: any) => Promise<void>
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>
  removeStudent: (id: string) => Promise<void>
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  total: 0,
  fetchStudents: async (params) => {
    try {
      const res = await studentApi.getAll(params) as any
      set({ students: res.data || [], total: res.total || 0 })
    } catch (err) { console.error('Fetch students error', err) }
  },
  addStudent: async (data) => {
    try {
      await studentApi.create(data)
      get().fetchStudents({ classId: data.classId })
    } catch (err) { console.error('Add student error', err) }
  },
  updateStudent: async (id, data) => {
    try {
      await studentApi.update(id, data)
      set((s) => ({
        students: s.students.map(st => st.id === id ? { ...st, ...data } : st)
      }))
    } catch (err) { console.error('Update student error', err) }
  },
  removeStudent: async (id) => {
    try {
      await studentApi.remove(id)
      set((s) => ({
        students: s.students.filter(st => st.id !== id),
        total: s.total - 1
      }))
    } catch (err) { console.error('Remove student error', err) }
  },
}))

// ── Grade Store ────────────────────────────────────────────
interface GradeState {
  gradeEntries: GradeEntry[]
  gradeSummaries: StudentGradeSummary[]
  importGrades: (entries: GradeEntry[]) => void
}

export const useGradeStore = create<GradeState>(() => ({
  gradeEntries: initGrades,
  gradeSummaries: initSummaries,
  importGrades: (entries) => {
    console.log('Import', entries.length, 'entries')
  },
}))

// ── Forum Store ────────────────────────────────────────────
interface ForumState {
  posts: ForumPost[]
  addPost: (content: string) => void
  likePost: (postId: string, userId: string) => void
  addComment: (postId: string, userId: string, userName: string, content: string) => void
}

export const useForumStore = create<ForumState>((set) => ({
  posts: initPosts,
  addPost: (content) => set((s) => ({
    posts: [{
      id: `p${Date.now()}`,
      authorId: 'cvht001',
      authorName: 'TRẦN ĐỨC LONG',
      authorRole: 'cvht',
      classId: 'K23-CNTT-01',
      content,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    }, ...s.posts]
  })),
  likePost: (postId, userId) => set((s) => ({
    posts: s.posts.map(p => {
      if (p.id !== postId) return p
      const liked = p.likes.includes(userId)
      return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] }
    })
  })),
  addComment: (postId, userId, userName, content) => set((s) => ({
    posts: s.posts.map(p => p.id !== postId ? p : {
      ...p,
      comments: [...p.comments, {
        id: `c${Date.now()}`,
        authorId: userId,
        authorName: userName,
        content,
        createdAt: new Date().toISOString(),
      }]
    })
  })),
}))

// ── Message Store ──────────────────────────────────────────
interface MessageState {
  conversations: Conversation[]
  activeConvId: string | null
  setActiveConv: (id: string) => void
  sendMessage: (toId: string, toName: string, content: string) => void
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: initConvs,
  activeConvId: '22020001',
  setActiveConv: (id) => set({ activeConvId: id }),
  sendMessage: (toId, toName, content) => set((s) => {
    const exists = s.conversations.find(c => c.participantId === toId)
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: 'cvht001',
      receiverId: toId,
      content,
      createdAt: new Date().toISOString(),
      read: true,
    }
    if (exists) {
      return {
        conversations: s.conversations.map(c =>
          c.participantId === toId
            ? { ...c, messages: [...c.messages, newMsg], lastMessage: content, lastTime: 'vừa xong', unread: 0 }
            : c
        )
      }
    }
    return {
      conversations: [{
        participantId: toId,
        participantName: toName,
        lastMessage: content,
        lastTime: 'vừa xong',
        unread: 0,
        messages: [newMsg],
      }, ...s.conversations],
      activeConvId: toId,
    }
  }),
}))

// ── Notification Store ─────────────────────────────────────
interface NotifState {
  notifications: Notification[]
  markAllRead: () => void
  markRead: (id: string) => void
}

export const useNotifStore = create<NotifState>((set) => ({
  notifications: initNotifs,
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map(n => ({ ...n, read: true }))
  })),
  markRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
}))
