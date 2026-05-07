import { create } from 'zustand'
import type { Student, ForumPost, Conversation, Notification, Class, Semester, GradeEntry } from '../types'
import {
  students as initStudents,
  forumPosts as initPosts,
  conversations as initConvs,
  notifications as initNotifs,
  classes as initClasses,
  semesters as initSemesters,
  gradeEntries as initGrades,
  gradeSummaries as initSummaries,
} from '../lib/mockData'
import type { StudentGradeSummary } from '../types'

// ── App Store ──────────────────────────────────────────────
interface AppState {
  currentClassId: string
  setCurrentClassId: (id: string) => void
  classes: Class[]
  addClass: (name: string) => void
  semesters: Semester[]
  currentSemesterId: string
  setCurrentSemesterId: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentClassId: 'K23-CNTT-01',
  setCurrentClassId: (id) => set({ currentClassId: id }),
  classes: initClasses,
  addClass: (name) => set((s) => ({
    classes: [...s.classes, { id: name, name, year: new Date().getFullYear(), advisorId: 'cvht001' }]
  })),
  semesters: initSemesters,
  currentSemesterId: 'HK2-2024',
  setCurrentSemesterId: (id) => set({ currentSemesterId: id }),
}))

// ── Student Store ──────────────────────────────────────────
interface StudentState {
  students: Student[]
  addStudents: (emails: string[], classId: string) => void
  updateStudent: (id: string, data: Partial<Student>) => void
  removeStudent: (id: string) => void
}

export const useStudentStore = create<StudentState>((set) => ({
  students: initStudents,
  addStudents: (emails, classId) => set((s) => ({
    students: [
      ...s.students,
      ...emails.map((email, i) => ({
        id: `NEW${Date.now()}${i}`,
        name: email.split('@')[0],
        email,
        phone: '—',
        dob: '',
        address: '',
        status: 'normal' as const,
        classId,
      }))
    ]
  })),
  updateStudent: (id, data) => set((s) => ({
    students: s.students.map(st => st.id === id ? { ...st, ...data } : st)
  })),
  removeStudent: (id) => set((s) => ({
    students: s.students.filter(st => st.id !== id)
  })),
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
    // TODO: merge with existing
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
