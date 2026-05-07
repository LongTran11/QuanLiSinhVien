import { Response } from 'express'
import Class from '../models/Class'
import Student from '../models/Student'
import Grade from '../models/Grade'
import { AuthRequest } from '../middleware/auth'

// GET /api/classes
export const getClasses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.user!.role === 'cvht' ? { advisorId: req.user!._id } : {}
    const classes = await Class.find(filter).populate('advisorId', 'name email')
    res.json({ success: true, data: classes })
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Lỗi server' })
  }
}

// POST /api/classes
export const createClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cls = await Class.create({ ...req.body, advisorId: req.user!._id })
    res.status(201).json({ success: true, data: cls })
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Lỗi server' })
  }
}

// GET /api/classes/:id/stats — thống kê lớp
export const getClassStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { semesterId } = req.query
    const students = await Student.find({ classId: id })
    const total = students.length
    const byStatus = students.reduce<Record<string, number>>((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    }, {})

    let avgGpa = 0
    if (semesterId) {
      const grades = await Grade.find({ classId: id, semesterId }).populate('subjectId', 'credits')
      if (grades.length) {
        const gpaMap = new Map<string, { sum: number; credits: number }>()
        for (const g of grades) {
          const subj = g.subjectId as unknown as { credits: number }
          const sid = String(g.studentId)
          if (!gpaMap.has(sid)) gpaMap.set(sid, { sum: 0, credits: 0 })
          const entry = gpaMap.get(sid)!
          entry.sum     += g.score4 * (subj?.credits || 0)
          entry.credits += subj?.credits || 0
        }
        const gpas = Array.from(gpaMap.values()).map(v => v.credits > 0 ? v.sum / v.credits : 0)
        avgGpa = gpas.length ? parseFloat((gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2)) : 0
      }
    }

    res.json({ success: true, data: { total, byStatus, avgGpa } })
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Lỗi server' })
  }
}
