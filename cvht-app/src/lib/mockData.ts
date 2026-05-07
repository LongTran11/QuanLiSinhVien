import type {
  Student, Subject, Semester, GradeEntry,
  StudentGradeSummary, Class, ForumPost, Conversation, Notification, User
} from '../types'

export const currentUser: User = {
  id: 'cn2301b',
  name: 'Trần Đức Long',
  email: 'longtd3204@ut.edu.vn',
  role: 'cvht',
}

export const classes: Class[] = [
  { id: 'K23-CNTT-01', name: 'K23-CNTT-01', year: 2025, advisorId: 'CN2301B1' },
  { id: 'K23-CNTT-02', name: 'K23-CNTT-02', year: 2025, advisorId: 'CN2301B2' },
]

export const semesters: Semester[] = [
  { id: 'HK1-2025', name: 'HK1/2025', startDate: '2025-09-01', endDate: '2026-01-15' },
  { id: 'HK2-2025', name: 'HK2/2025', startDate: '2025-01-20', endDate: '2025-06-15' },
  { id: 'HK1-2026', name: 'HK1/2026', startDate: '2025-09-01', endDate: '2026-01-15' },
  { id: 'HK2-2026', name: 'HK2/2026', startDate: '2026-01-20', endDate: '2026-06-15' },
]

export const students: Student[] = [
  { id: '22020001', name: 'Nguyễn Văn An', email: '22020001@ut.edu.vn', phone: '0912345678', dob: '2004-03-12', address: 'Hà Nội', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020002', name: 'Trần Thị Bình', email: '22020002@ut.edu.vn', phone: '0923456789', dob: '2004-07-22', address: 'Hải Phòng', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020003', name: 'Lê Minh Đức', email: '22020003@ut.edu.vn', phone: '0934567890', dob: '2004-01-05', address: 'Hà Nội', status: 'warn3', classId: 'K23-CNTT-01' },
  { id: '22020004', name: 'Phạm Thu Hà', email: '22020004@ut.edu.vn', phone: '0945678901', dob: '2004-11-18', address: 'Nam Định', status: 'warn2', classId: 'K23-CNTT-01' },
  { id: '22020005', name: 'Vũ Đình Nam', email: '22020005@ut.edu.vn', phone: '0956789012', dob: '2004-06-30', address: 'Thái Bình', status: 'warn2', classId: 'K23-CNTT-01' },
  { id: '22020006', name: 'Đỗ Lan Anh', email: '22020006@ut.edu.vn', phone: '0967890123', dob: '2004-09-14', address: 'Hưng Yên', status: 'warn1', classId: 'K23-CNTT-01' },
  { id: '22020007', name: 'Hoàng Quốc Bảo', email: '22020007@ut.edu.vn', phone: '0978901234', dob: '2004-04-25', address: 'Hà Nội', status: 'debt', classId: 'K23-CNTT-01' },
  { id: '22020008', name: 'Nguyễn Thùy Linh', email: '22020008@ut.edu.vn', phone: '0989012345', dob: '2004-12-08', address: 'Hà Nội', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020009', name: 'Trần Minh Khoa', email: '22020009@ut.edu.vn', phone: '0990123456', dob: '2004-02-19', address: 'Bắc Ninh', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020010', name: 'Bùi Thị Mai', email: '22020010@ut.edu.vn', phone: '0901234567', dob: '2004-08-03', address: 'Vĩnh Phúc', status: 'debt', classId: 'K23-CNTT-01' },
  { id: '22020011', name: 'Đinh Văn Tùng', email: '22020011@ut.edu.vn', phone: '0911234567', dob: '2004-05-11', address: 'Quảng Ninh', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020012', name: 'Lý Thị Ngọc', email: '22020012@ut.edu.vn', phone: '0922345678', dob: '2004-10-29', address: 'Hà Nội', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020013', name: 'Phùng Đức Anh', email: '22020013@ut.edu.vn', phone: '0933456789', dob: '2004-01-17', address: 'Hải Dương', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020014', name: 'Trịnh Thị Hoa', email: '22020014@ut.edu.vn', phone: '0944567890', dob: '2004-07-04', address: 'Ninh Bình', status: 'normal', classId: 'K23-CNTT-01' },
  { id: '22020015', name: 'Ngô Minh Tuấn', email: '22020015@ut.edu.vn', phone: '0955678901', dob: '2004-03-28', address: 'Hà Nội', status: 'normal', classId: 'K23-CNTT-01' },
]

export const subjects: Subject[] = [
  { id: 'INT1001', code: 'INT1001', name: 'Nhập môn lập trình', credits: 3 },
  { id: 'INT1002', code: 'INT1002', name: 'Kỹ thuật lập trình', credits: 3 },
  { id: 'MAT1001', code: 'MAT1001', name: 'Giải tích 1', credits: 3 },
  { id: 'MAT1002', code: 'MAT1002', name: 'Đại số tuyến tính', credits: 3 },
  { id: 'PHY1001', code: 'PHY1001', name: 'Vật lý đại cương', credits: 3 },
  { id: 'INT2001', code: 'INT2001', name: 'Cơ sở dữ liệu', credits: 3 },
  { id: 'INT2002', code: 'INT2002', name: 'Mạng máy tính', credits: 3 },
  { id: 'INT2003', code: 'INT2003', name: 'Kiến trúc máy tính', credits: 3 },
  { id: 'MAT2001', code: 'MAT2001', name: 'Giải tích 2', credits: 3 },
  { id: 'INT2004', code: 'INT2004', name: 'Lập trình hướng đối tượng', credits: 3 },
]

function score10to4(s: number): number {
  if (s >= 9.0) return 4.0
  if (s >= 8.5) return 3.7
  if (s >= 8.0) return 3.5
  if (s >= 7.5) return 3.2
  if (s >= 7.0) return 3.0
  if (s >= 6.5) return 2.5
  if (s >= 6.0) return 2.0
  if (s >= 5.5) return 1.5
  if (s >= 5.0) return 1.0
  return 0.0
}
function score10toLetter(s: number): string {
  if (s >= 9.0) return 'A+'
  if (s >= 8.5) return 'A'
  if (s >= 8.0) return 'B+'
  if (s >= 7.5) return 'B'
  if (s >= 7.0) return 'C+'
  if (s >= 6.5) return 'C'
  if (s >= 6.0) return 'D+'
  if (s >= 5.0) return 'D'
  return 'F'
}

const baseScores: Record<string, number[]> = {
  '22020001': [8.5, 8.0, 9.0, 7.5, 8.5, 8.0, 9.0, 8.5, 7.0, 8.0],
  '22020002': [7.5, 7.0, 8.0, 7.0, 7.5, 7.0, 8.0, 7.5, 6.5, 7.0],
  '22020003': [3.0, 2.5, 3.5, 2.0, 3.0, 2.5, 3.0, 3.5, 2.5, 2.0],
  '22020004': [4.5, 4.0, 5.0, 4.0, 4.5, 4.0, 4.5, 5.0, 4.0, 4.5],
  '22020005': [5.0, 4.5, 5.0, 4.0, 5.0, 4.5, 5.0, 5.5, 4.5, 4.5],
  '22020006': [5.5, 5.0, 5.5, 5.0, 5.5, 5.0, 5.5, 6.0, 5.0, 5.0],
  '22020007': [7.0, 6.5, 7.5, 6.5, 7.0, 6.5, 7.0, 7.5, 6.0, 6.5],
  '22020008': [8.5, 8.5, 9.0, 8.0, 8.5, 8.5, 9.0, 8.5, 8.0, 8.5],
  '22020009': [9.0, 9.5, 9.5, 8.5, 9.0, 9.5, 9.0, 9.5, 8.5, 9.0],
  '22020010': [6.5, 6.0, 7.0, 6.0, 6.5, 6.0, 7.0, 6.5, 5.5, 6.0],
  '22020011': [7.5, 7.0, 8.0, 7.5, 7.5, 7.0, 8.0, 7.5, 7.0, 7.5],
  '22020012': [8.0, 7.5, 8.5, 7.5, 8.0, 7.5, 8.5, 8.0, 7.0, 7.5],
  '22020013': [7.0, 6.5, 7.5, 6.5, 7.0, 6.5, 7.5, 7.0, 6.5, 7.0],
  '22020014': [8.0, 8.0, 8.5, 7.5, 8.0, 8.0, 8.5, 8.0, 7.5, 8.0],
  '22020015': [7.5, 7.0, 8.0, 7.0, 7.5, 7.0, 8.0, 7.5, 6.5, 7.5],
}

export const gradeEntries: GradeEntry[] = []
students.forEach(s => {
  const scores = baseScores[s.id] || Array(10).fill(6.0)
  subjects.forEach((subj, i) => {
    const score10 = scores[i] || 6.0
    gradeEntries.push({
      studentId: s.id,
      subjectId: subj.id,
      semesterId: i < 5 ? 'HK1-2024' : 'HK2-2024',
      score10,
      score4: score10to4(score10),
      letterGrade: score10toLetter(score10),
    })
  })
})

export const gradeSummaries: StudentGradeSummary[] = students.map(s => {
  const entries = gradeEntries.filter(g => g.studentId === s.id)
  const totalCredits = entries.reduce((acc, g) => {
    const subj = subjects.find(x => x.id === g.subjectId)
    return acc + (subj?.credits || 0)
  }, 0)
  const weightedSum = entries.reduce((acc, g) => {
    const subj = subjects.find(x => x.id === g.subjectId)
    return acc + g.score4 * (subj?.credits || 0)
  }, 0)
  const gpa4 = totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0
  const gpa10 = parseFloat((gpa4 * 2.5).toFixed(2))
  return {
    studentId: s.id,
    semesterId: 'HK2-2024',
    gpa4,
    gpa10,
    totalCredits,
    cumulativeGpa4: gpa4,
    cumulativeCredits: totalCredits,
    academicStatus: s.status,
  }
})

export const forumPosts: ForumPost[] = [
  {
    id: 'p1',
    authorId: 'cvht001',
    authorName: 'TRẦN ĐỨC LONG',
    authorRole: 'cvht',
    classId: 'K23-CNTT-01',
    content: '📢 Các em lưu ý: Deadline đăng ký môn học HK1/2025 là ngày 15/6/2025. Các em vào cổng đăng ký sớm để tránh hết chỗ nhé!',
    createdAt: '2025-05-06T08:00:00Z',
    likes: ['22020001', '22020002', '22020008'],
    comments: [
      { id: 'c1', authorId: '22020001', authorName: 'Nguyễn Văn An', content: 'Vâng thầy, em đã đăng ký xong rồi ạ!', createdAt: '2025-05-06T08:15:00Z' },
      { id: 'c2', authorId: '22020002', authorName: 'Trần Thị Bình', content: 'Thầy ơi em bị lỗi khi đăng ký môn Giải tích 2, thầy giúp em với ạ', createdAt: '2025-05-06T08:30:00Z' },
    ],
  },
  {
    id: 'p2',
    authorId: '22020002',
    authorName: 'Trần Thị Bình',
    authorRole: 'student',
    classId: 'K23-CNTT-01',
    content: 'Mọi người ơi ai có tài liệu môn Mạng máy tính không chia sẻ cho mình với ạ? Mình đang cần gấp để ôn thi cuối kỳ 😭',
    createdAt: '2025-05-06T06:00:00Z',
    likes: ['22020008', '22020009'],
    comments: [
      { id: 'c3', authorId: '22020007', authorName: 'Hoàng Quốc Bảo', content: 'Mình có, để mình gửi lên Drive cho cả lớp nhé', createdAt: '2025-05-06T06:20:00Z' },
    ],
  },
  {
    id: 'p3',
    authorId: '22020009',
    authorName: 'Trần Minh Khoa',
    authorRole: 'student',
    classId: 'K23-CNTT-01',
    content: 'Mọi người ơi ngày mai có buổi seminar về AI tại Hội trường A, 14h chiều. Ai rảnh cùng đi không? Nghe nói hay lắm 🔥',
    createdAt: '2025-05-05T20:00:00Z',
    likes: ['22020001', '22020008', '22020011', '22020012'],
    comments: [],
  },
]

export const conversations: Conversation[] = [
  {
    participantId: '22020001',
    participantName: 'Nguyễn Văn An',
    lastMessage: 'Vâng thầy, em cảm ơn thầy nhiều ạ!',
    lastTime: '10 phút trước',
    unread: 0,
    messages: [
      { id: 'm1', senderId: '22020001', receiverId: 'cvht001', content: 'Thầy ơi em muốn hỏi về việc đăng ký học phần ạ', createdAt: '2025-05-06T07:00:00Z', read: true },
      { id: 'm2', senderId: 'cvht001', receiverId: '22020001', content: 'Em hỏi đi nhé, thầy đang rảnh', createdAt: '2025-05-06T07:02:00Z', read: true },
      { id: 'm3', senderId: '22020001', receiverId: 'cvht001', content: 'Em không đăng ký được môn Giải tích 2, hệ thống báo hết chỗ ạ', createdAt: '2025-05-06T07:05:00Z', read: true },
      { id: 'm4', senderId: 'cvht001', receiverId: '22020001', content: 'Thầy sẽ liên hệ phòng đào tạo xem lại cho em. Em chờ thầy nhé', createdAt: '2025-05-06T07:10:00Z', read: true },
      { id: 'm5', senderId: '22020001', receiverId: 'cvht001', content: 'Vâng thầy, em cảm ơn thầy nhiều ạ!', createdAt: '2025-05-06T07:12:00Z', read: true },
    ],
  },
  {
    participantId: '22020003',
    participantName: 'Lê Minh Đức',
    lastMessage: 'Vâng thầy, em sẽ đến gặp thầy',
    lastTime: '2 giờ trước',
    unread: 1,
    messages: [
      { id: 'm6', senderId: 'cvht001', receiverId: '22020003', content: 'Đức ơi, thầy muốn gặp em để trao đổi về tình hình học tập nhé', createdAt: '2025-05-06T05:00:00Z', read: true },
      { id: 'm7', senderId: '22020003', receiverId: 'cvht001', content: 'Thưa thầy, em có việc gì không ạ?', createdAt: '2025-05-06T05:30:00Z', read: true },
      { id: 'm8', senderId: 'cvht001', receiverId: '22020003', content: 'GPA kỳ này của em xuống thấp quá, thầy cần nói chuyện với em và gia đình', createdAt: '2025-05-06T05:35:00Z', read: true },
      { id: 'm9', senderId: '22020003', receiverId: 'cvht001', content: 'Vâng thầy, em sẽ đến gặp thầy', createdAt: '2025-05-06T06:00:00Z', read: false },
    ],
  },
  {
    participantId: '22020004',
    participantName: 'Phạm Thu Hà',
    lastMessage: 'Em mang đơn lên thầy nhé',
    lastTime: '1 ngày trước',
    unread: 0,
    messages: [
      { id: 'm10', senderId: '22020004', receiverId: 'cvht001', content: 'Thầy ơi em cần thầy ký đơn xin hoãn thi ạ', createdAt: '2025-05-05T08:00:00Z', read: true },
      { id: 'm11', senderId: 'cvht001', receiverId: '22020004', content: 'Em mang đơn lên phòng thầy nhé, thứ 3 này thầy có mặt', createdAt: '2025-05-05T08:30:00Z', read: true },
      { id: 'm12', senderId: '22020004', receiverId: 'cvht001', content: 'Em mang đơn lên thầy nhé', createdAt: '2025-05-05T09:00:00Z', read: true },
    ],
  },
]

export const notifications: Notification[] = [
  { id: 'n1', type: 'message', content: 'Nguyễn Văn An gửi tin nhắn mới', createdAt: '2025-05-06T07:12:00Z', read: false, link: '/messages' },
  { id: 'n2', type: 'forum', content: 'Trần Thị Bình đăng bài mới lên diễn đàn', createdAt: '2025-05-06T06:00:00Z', read: false, link: '/forum' },
  { id: 'n3', type: 'grade', content: 'Điểm HK2/2024 của lớp đã được cập nhật', createdAt: '2025-05-06T05:00:00Z', read: true, link: '/grades' },
  { id: 'n4', type: 'system', content: 'Deadline đăng ký môn học: còn 9 ngày', createdAt: '2025-05-06T00:00:00Z', read: true },
]
