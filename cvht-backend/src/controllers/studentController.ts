import { Response } from 'express'
import { Student, Class, User, Grade, Subject } from '../models'
import { AuthRequest } from '../middleware/auth'
import { Op } from 'sequelize'

// GET /api/students?classId=xxx&status=xxx&search=xxx
export const getStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, status, search, page = '1', limit = '50' } = req.query
    const where: any = {}
    
    if (classId) {
      // Nếu classId là số (ID), dùng trực tiếp. Nếu là chữ (tên lớp), tìm ID trước.
      if (isNaN(Number(classId))) {
        const cls = await Class.findOne({ where: { name: String(classId) } })
        if (cls) where.classId = cls.id
        else where.classId = 0 // Không tìm thấy lớp
      } else {
        where.classId = Number(classId)
      }
    }

    if (status)  where.status = status
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { studentId: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    }
    const offset = (parseInt(String(page)) - 1) * parseInt(String(limit))
    const { count, rows } = await Student.findAndCountAll({
      where,
      include: [{ model: Class, as: 'class', attributes: ['name'] }],
      order: [['studentId', 'ASC']],
      offset,
      limit: parseInt(String(limit)),
    })
    res.json({ success: true, data: rows, total: count, page: parseInt(String(page)), limit: parseInt(String(limit)) })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/students/:id
export const getStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Class, as: 'class', attributes: ['name'] }]
    })
    if (!student) { res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' }); return }
    res.json({ success: true, data: student })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/students
export const createStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, studentId, classId, phone, dob, address } = req.body
    let user = await User.findOne({ where: { email } })
    if (!user) {
      user = await User.create({ name, email, password: studentId, role: 'student', studentId })
    }
    const student = await Student.create({ userId: user.id, studentId, classId, name, email, phone, dob, address })
    res.status(201).json({ success: true, data: student })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// PUT /api/students/:id
export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findByPk(req.params.id)
    if (!student) { res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' }); return }
    await student.update(req.body)
    res.json({ success: true, data: student })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// DELETE /api/students/:id
export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findByPk(req.params.id)
    if (!student) { res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' }); return }
    await student.destroy()
    res.json({ success: true, message: 'Đã xóa sinh viên' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/students/:id/grades
export const getStudentGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const grades = await Grade.findAll({
      where: { studentId: req.params.id },
      include: [
        { model: Subject, as: 'subject', attributes: ['name', 'code', 'credits'] },
        { association: 'semester', attributes: ['name', 'semesterId'] }
      ],
      order: [['createdAt', 'DESC']]
    })
    const totalCredits = grades.reduce((acc, g) => {
      const subj = g.get('subject') as any
      return acc + (subj?.credits || 0)
    }, 0)
    const weightedSum = grades.reduce((acc, g) => {
      const subj = g.get('subject') as any
      return acc + g.score4 * (subj?.credits || 0)
    }, 0)
    const gpa4 = totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0
    res.json({ success: true, data: grades, summary: { gpa4, gpa10: parseFloat((gpa4 * 2.5).toFixed(2)), totalCredits } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}
