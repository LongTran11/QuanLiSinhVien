import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { User, Student, Class, Semester, Subject, Grade } from '../models'
import { score10to4, score10toLetter } from '../models/Grade'
import sequelize from '../config/database'
// Helper: Lấy giá trị từ object không phân biệt hoa thường, xóa ký tự ẩn (BOM) và hỗ trợ nhiều alias
const getVal = (obj: any, keys: string[], fallback: any = '') => {
  const entry = Object.entries(obj).find(([k]) => {
    const cleanK = k.replace(/[^\w\s\u00C0-\u1EF9]/gi, '').toLowerCase().trim()
    return keys.some(key => cleanK === key.replace(/[^\w\s\u00C0-\u1EF9]/gi, '').toLowerCase().trim())
  })
  const val = entry ? entry[1] : undefined
  return (val === undefined || val === null || val === '') ? fallback : val
}

export const importStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction()
  try {
    const { data } = req.body as { data: any[] }
    let count = 0
    for (const item of data) {
      const studentId = String(getVal(item, ['MSSV', 'studentId', 'Mã sinh viên'], ''))
      const email = String(getVal(item, ['Email', 'Thư điện tử'], ''))
      if (!studentId || !email) continue

      // Find or create class
      const className = String(getVal(item, ['ClassName', 'Lop', 'Lớp'], 'K23-CNTT-01'))
      const currentUserId = req.user?.id ? Number(req.user.id) : 1 // Fallback to ID 1 if not found
      
      const [cls] = await Class.findOrCreate({
        where: { name: className },
        defaults: { name: className, year: 2023, advisorId: currentUserId },
        transaction
      })

      const name = String(getVal(item, ['Ho_ten', 'Họ tên', 'Ho tên', 'Name', 'name'], 'Sinh viên mới'))
      
      // Upsert User
      await User.upsert({
        email,
        name,
        password: studentId, // Default password is MSSV
        role: 'student',
        studentId
      }, { transaction })

      const user = await User.findOne({ where: { email }, transaction })
      if (!user) continue

      // Upsert Student
      await Student.upsert({
        studentId,
        userId: user.id,
        classId: cls.id,
        name: user.name,
        email: user.email,
        phone: String(getVal(item, ['SDT', 'SĐT', 'Phone', 'Điện thoại'], '')),
        dob: String(getVal(item, ['Ngay_sinh', 'Ngày sinh', 'DOB'], '')),
        address: String(getVal(item, ['Dia_chi', 'Địa chỉ', 'Address'], '')),
        status: 'normal'
      }, { transaction })
      
      count++
    }
    await transaction.commit()
    res.json({ success: true, message: `Đã nhập/cập nhật ${count} sinh viên` })
  } catch (err: any) {
    await transaction.rollback()
    res.status(500).json({ success: false, message: err.message })
  }
}

export const importGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction()
  try {
    const { data } = req.body as { data: any[] }
    let count = 0
    for (const item of data) {
      const studentIdStr = getVal(item, ['MSSV', 'studentId', 'Mã sinh viên'])
      const subjectCode = getVal(item, ['Ma_mon', 'Ma_mon_hoc', 'SubjectCode', 'Mã môn'])
      const semesterIdStr = getVal(item, ['Ma_HK', 'Hoc_ky', 'SemesterId', 'Học kỳ'])
      
      if (!studentIdStr || !subjectCode || !semesterIdStr) continue

      const student = await Student.findOne({ where: { studentId: String(studentIdStr) }, transaction })
      const subject = await Subject.findOne({ where: { code: String(subjectCode) }, transaction })
      const semester = await Semester.findOne({ where: { semesterId: String(semesterIdStr) }, transaction })
      
      if (!student || !subject || !semester) continue

      const midScore = parseFloat(getVal(item, ['Diem_giua_ky', 'Giữa kỳ', 'MidScore'], 0))
      const finalScore = parseFloat(getVal(item, ['Diem_cuoi_ky', 'Cuối kỳ', 'FinalScore'], 0))
      let score10 = parseFloat(getVal(item, ['Diem_10', 'Tổng kết', 'Score10'], 0))
      
      if (midScore > 0 || finalScore > 0) {
        score10 = parseFloat((midScore * 0.4 + finalScore * 0.6).toFixed(2))
      }

      await Grade.upsert({
        studentId: student.id,
        subjectId: subject.id,
        semesterId: semester.id,
        classId: student.classId,
        midScore,
        finalScore,
        score10,
        score4: score10to4(score10),
        letterGrade: score10toLetter(score10)
      }, { transaction })
      count++
    }
    await transaction.commit()
    res.json({ success: true, message: `Đã nhập/cập nhật ${count} bản ghi điểm` })
  } catch (err: any) {
    await transaction.rollback()
    res.status(500).json({ success: false, message: err.message })
  }
}

export const importSemesters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data } = req.body as { data: any[] }
    let count = 0
    for (const item of data) {
      const semesterId = getVal(item, ['Ma_HK', 'Ma_hoc_ky', 'SemesterId', 'Mã học kỳ'])
      if (!semesterId) continue
      await Semester.upsert({
        semesterId: String(semesterId),
        name: String(getVal(item, ['Ten_HK', 'Ten_hoc_ky', 'Name', 'Tên học kỳ'], semesterId)),
        startDate: getVal(item, ['Ngay_bat_dau', 'StartDate', 'Ngày bắt đầu'], null),
        endDate: getVal(item, ['Ngay_ket_thuc', 'EndDate', 'Ngày kết thúc'], null),
        isActive: String(getVal(item, ['isActive', 'Dang_kich_hoat'], '0')) === '1'
      })
      count++
    }
    res.json({ success: true, message: `Đã nhập/cập nhật ${count} học kỳ` })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const importSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data } = req.body as { data: any[] }
    let count = 0
    for (const item of data) {
      const code = getVal(item, ['Ma_mon', 'Ma_mon_hoc', 'Code', 'Mã môn'])
      if (!code) continue
      await Subject.upsert({
        code: String(code),
        name: String(getVal(item, ['Ten_mon', 'Ten_mon_hoc', 'Name', 'Tên môn'], code)),
        credits: parseInt(getVal(item, ['So_tin_chi', 'Credits', 'Số tín chỉ'], 0)),
        department: String(getVal(item, ['Khoa', 'Department'], 'Khoa CNTT'))
      })
      count++
    }
    res.json({ success: true, message: `Đã nhập/cập nhật ${count} môn học` })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
}
