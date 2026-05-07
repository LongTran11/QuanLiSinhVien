export type UserRole = 'cvht' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export type StudentStatus = 'normal' | 'warn1' | 'warn2' | 'warn3' | 'debt' | 'suspended'

export interface Student {
  id: string        // MSSV
  name: string
  email: string
  phone: string
  dob: string
  address: string
  status: StudentStatus
  classId: string
}

export interface Subject {
  id: string
  code: string
  name: string
  credits: number
}

export interface GradeEntry {
  studentId: string
  subjectId: string
  semesterId: string
  score10: number   // thang 10
  score4: number    // thang 4
  letterGrade: string
}

export interface Semester {
  id: string
  name: string      // VD: "HK1/2024"
  startDate: string
  endDate: string
}

export interface StudentGradeSummary {
  studentId: string
  semesterId: string
  gpa4: number
  gpa10: number
  totalCredits: number
  cumulativeGpa4: number
  cumulativeCredits: number
  academicStatus: StudentStatus
}

export interface Class {
  id: string
  name: string
  year: number
  advisorId: string
}

export interface ForumPost {
  id: string
  authorId: string
  authorName: string
  authorRole: UserRole
  classId: string
  content: string
  createdAt: string
  likes: string[]   // array of userId
  comments: ForumComment[]
}

export interface ForumComment {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  participantId: string
  participantName: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

export interface Notification {
  id: string
  type: 'message' | 'forum' | 'grade' | 'system'
  content: string
  createdAt: string
  read: boolean
  link?: string
}
