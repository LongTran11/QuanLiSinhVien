import { Response } from 'express'
import Student from '../models/Student'
import Class from '../models/Class'
import User from '../models/User'
import Grade from '../models/Grade'
import { AuthRequest } from '../middleware/auth'
import mongoose from 'mongoose'

// GET /api/students?classId=xxx&status=xxx&search=xxx
export const getStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, status, search, page = '1', limit = '50' } = req.query
    const filter: Record<string, unknown> = {}
    if (classId) filter.classId = classId
    if (status)  filter.status = status
    if (search) {
      const regex = new RegExp(String(search), 'i')
      filter.$or = [{ name: regex }, { studentId: regex }, { email: regex }]
    }
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit))
    const [students, total] = await Promise.all([
      Student.find(filter).populate('classId', 'name').sort({ studentId: 1 }).skip(skip).limit(parseInt(String(limit))),
      Student.countDocuments(filter),
    ])
    res.json({ success: true, data: students, total, page: parseInt(String(page)), limit: parseInt(String(limit)) })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/students/:id
export const getStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'name')
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
    const existingUser = await User.findOne({ email })
    let userId: mongoose.Types.ObjectId
    if (existingUser) {
      userId = existingUser._id as mongoose.Types.ObjectId
    } else {
      const newUser = await User.create({ name, email, password: studentId, role: 'student', studentId })
      userId = newUser._id as mongoose.Types.ObjectId
    }
    const student = await Student.create({ userId, studentId, classId, name, email, phone, dob, address })
    await Class.findByIdAndUpdate(classId, { $addToSet: { students: userId } })
    res.status(201).json({ success: true, data: student })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// PUT /api/students/:id
export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!student) { res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' }); return }
    res.json({ success: true, data: student })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// DELETE /api/students/:id
export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)
    if (!student) { res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' }); return }
    await Class.findByIdAndUpdate(student.classId, { $pull: { students: student.userId } })
    res.json({ success: true, message: 'Đã xóa sinh viên' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/students/:id/grades
export const getStudentGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const grades = await Grade.find({ studentId: req.params.id })
      .populate('subjectId', 'name code credits')
      .populate('semesterId', 'name semesterId')
      .sort({ createdAt: -1 })
    const totalCredits = grades.reduce((acc, g) => {
      const subj = g.subjectId as unknown as { credits: number }
      return acc + (subj?.credits || 0)
    }, 0)
    const weightedSum = grades.reduce((acc, g) => {
      const subj = g.subjectId as unknown as { credits: number }
      return acc + g.score4 * (subj?.credits || 0)
    }, 0)
    const gpa4 = totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0
    res.json({ success: true, data: grades, summary: { gpa4, gpa10: parseFloat((gpa4 * 2.5).toFixed(2)), totalCredits } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}
