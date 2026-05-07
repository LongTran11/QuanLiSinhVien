import dotenv from 'dotenv'
dotenv.config()

import { User, Class, Student, Semester, Subject, Grade, ForumPost } from '../models'
import sequelize from '../config/database'

async function seed() {
  await sequelize.sync({ force: true }) // WARNING: This drops tables and recreates them
  console.log('✅ MySQL tables recreated')

  // ── Users ──
  const cvht = await User.create({
    name: 'TRẦN ĐỨC LONG', email: 'cvht001@ut.edu.vn',
    password: 'cvht123456', role: 'cvht',
  })
  const admin = await User.create({
    name: 'Admin Hệ thống', email: 'admin@ut.edu.vn',
    password: 'admin123456', role: 'admin',
  })
  console.log('👤 Created CVHT + Admin users')

  // ── Semesters ──
  const semesters = await Semester.bulkCreate([
    { semesterId: 'HK1-2023', name: 'HK1/2023', startDate: '2023-09-01', endDate: '2024-01-15' },
    { semesterId: 'HK2-2023', name: 'HK2/2023', startDate: '2024-01-20', endDate: '2024-06-15' },
    { semesterId: 'HK1-2024', name: 'HK1/2024', startDate: '2024-09-01', endDate: '2025-01-15' },
    { semesterId: 'HK2-2024', name: 'HK2/2024', startDate: '2025-01-20', endDate: '2025-06-15', isActive: true },
  ])
  console.log('📅 Created semesters')

  // ── Subjects ──
  const subjects = await Subject.bulkCreate([
    { code: 'INT1001', name: 'Nhập môn lập trình',          credits: 3 },
    { code: 'INT1002', name: 'Kỹ thuật lập trình',          credits: 3 },
    { code: 'MAT1001', name: 'Giải tích 1',                 credits: 3 },
    { code: 'MAT1002', name: 'Đại số tuyến tính',           credits: 3 },
    { code: 'PHY1001', name: 'Vật lý đại cương',            credits: 3 },
    { code: 'INT2001', name: 'Cơ sở dữ liệu',               credits: 3 },
    { code: 'INT2002', name: 'Mạng máy tính',               credits: 3 },
    { code: 'INT2003', name: 'Kiến trúc máy tính',          credits: 3 },
    { code: 'MAT2001', name: 'Giải tích 2',                 credits: 3 },
    { code: 'INT2004', name: 'Lập trình hướng đối tượng',   credits: 3 },
  ])
  console.log('📚 Created subjects')

  // ── Class ──
  const cls = await Class.create({
    name: 'K23-CNTT-01', year: 2022, advisorId: cvht.id,
  })

  // ── Students ──
  const studentData = [
    { studentId: '22020001', name: 'Nguyễn Văn An',   email: '22020001@ut.edu.vn', phone: '0912345678', dob: '2004-03-12', address: 'Hà Nội',    status: 'normal' },
    { studentId: '22020002', name: 'Trần Thị Bình',   email: '22020002@ut.edu.vn', phone: '0923456789', dob: '2004-07-22', address: 'Hải Phòng', status: 'normal' },
    { studentId: '22020003', name: 'Lê Minh Đức',     email: '22020003@ut.edu.vn', phone: '0934567890', dob: '2004-01-05', address: 'Hà Nội',    status: 'warn3'  },
    { studentId: '22020004', name: 'Phạm Thu Hà',     email: '22020004@ut.edu.vn', phone: '0945678901', dob: '2004-11-18', address: 'Nam Định',  status: 'warn2'  },
    { studentId: '22020005', name: 'Vũ Đình Nam',     email: '22020005@ut.edu.vn', phone: '0956789012', dob: '2004-06-30', address: 'Thái Bình', status: 'warn2'  },
    { studentId: '22020006', name: 'Đỗ Lan Anh',      email: '22020006@ut.edu.vn', phone: '0967890123', dob: '2004-09-14', address: 'Hưng Yên',  status: 'warn1'  },
    { studentId: '22020007', name: 'Hoàng Quốc Bảo',  email: '22020007@ut.edu.vn', phone: '0978901234', dob: '2004-04-25', address: 'Hà Nội',    status: 'debt'   },
    { studentId: '22020008', name: 'Nguyễn Thùy Linh',email: '22020008@ut.edu.vn', phone: '0989012345', dob: '2004-12-08', address: 'Hà Nội',    status: 'normal' },
    { studentId: '22020009', name: 'Trần Minh Khoa',  email: '22020009@ut.edu.vn', phone: '0990123456', dob: '2004-02-19', address: 'Bắc Ninh',  status: 'normal' },
    { studentId: '22020010', name: 'Bùi Thị Mai',     email: '22020010@ut.edu.vn', phone: '0901234567', dob: '2004-08-03', address: 'Vĩnh Phúc', status: 'debt'   },
  ]

  const baseScores: Record<string, number[]> = {
    '22020001': [8.5,8.0,9.0,7.5,8.5,8.0,9.0,8.5,7.0,8.0],
    '22020002': [7.5,7.0,8.0,7.0,7.5,7.0,8.0,7.5,6.5,7.0],
    '22020003': [3.0,2.5,3.5,2.0,3.0,2.5,3.0,3.5,2.5,2.0],
    '22020004': [4.5,4.0,5.0,4.0,4.5,4.0,4.5,5.0,4.0,4.5],
    '22020005': [5.0,4.5,5.0,4.0,5.0,4.5,5.0,5.5,4.5,4.5],
    '22020006': [5.5,5.0,5.5,5.0,5.5,5.0,5.5,6.0,5.0,5.0],
    '22020007': [7.0,6.5,7.5,6.5,7.0,6.5,7.0,7.5,6.0,6.5],
    '22020008': [8.5,8.5,9.0,8.0,8.5,8.5,9.0,8.5,8.0,8.5],
    '22020009': [9.0,9.5,9.5,8.5,9.0,9.5,9.0,9.5,8.5,9.0],
    '22020010': [6.5,6.0,7.0,6.0,6.5,6.0,7.0,6.5,5.5,6.0],
  }

  const studentIds: number[] = []
  for (const sd of studentData) {
    const user = await User.create({ name: sd.name, email: sd.email, password: sd.studentId, role: 'student', studentId: sd.studentId })
    const student = await Student.create({ userId: user.id, ...sd, classId: cls.id, status: sd.status as any })
    studentIds.push(student.id)

    // Grades
    const scores = baseScores[sd.studentId] || Array(10).fill(6.0)
    for (let i = 0; i < subjects.length; i++) {
      const semIdx = i < 5 ? 2 : 3   // HK1-2024 or HK2-2024
      await Grade.create({
        studentId:  student.id,
        subjectId:  subjects[i].id,
        semesterId: semesters[semIdx].id,
        classId:    cls.id,
        score10:    scores[i],
      })
    }
  }

  console.log(`🎓 Created ${studentData.length} students with grades`)

  // ── Forum Posts ──
  await ForumPost.bulkCreate([
    {
      classId: cls.id, authorId: cvht.id, authorName: 'TRẦN ĐỨC LONG', authorRole: 'cvht',
      content: '📢 Các em lưu ý: Deadline đăng ký môn học HK1/2025 là ngày 15/6/2025. Các em vào cổng đăng ký sớm để tránh hết chỗ nhé!',
      isPinned: true, likes: [], comments: []
    },
    {
      classId: cls.id, authorId: studentIds[1], authorName: 'Trần Thị Bình', authorRole: 'student',
      content: 'Mọi người ơi ai có tài liệu môn Mạng máy tính không chia sẻ cho mình với ạ? Mình đang cần gấp để ôn thi cuối kỳ 😭',
      likes: [], comments: []
    },
  ])
  console.log('💬 Created forum posts')

  console.log('\n✅ Seed completed!')
  console.log('─'.repeat(40))
  console.log('🔑 Tài khoản CVHT  : cvht001@ut.edu.vn / cvht123456')
  console.log('🔑 Tài khoản Admin : admin@ut.edu.vn   / admin123456')
  console.log('🔑 Tài khoản SV    : 22020001@ut.edu.vn / 22020001')
  console.log('─'.repeat(40))

  await sequelize.close()
}

seed().catch(err => { console.error(err); process.exit(1) })
