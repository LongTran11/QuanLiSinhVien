import { Response } from 'express'
import Grade from '../models/Grade'
import Student from '../models/Student'
import { AuthRequest } from '../middleware/auth'

// GET /api/grades?classId=&semesterId=
export const getGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, semesterId, studentId } = req.query
    const filter: Record<string, unknown> = {}
    if (classId)   filter.classId   = classId
    if (semesterId) filter.semesterId = semesterId
    if (studentId)  filter.studentId  = studentId
    const grades = await Grade.find(filter)
      .populate('studentId', 'name studentId')
      .populate('subjectId', 'name code credits')
      .populate('semesterId', 'name')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: grades })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/grades
export const createGrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const grade = await Grade.create(req.body)
    await updateStudentStatus(String(grade.studentId))
    res.status(201).json({ success: true, data: grade })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(err instanceof Error && (err as NodeJS.ErrnoException).code === '11000' ? 409 : 500)
       .json({ success: false, message })
  }
}

// PUT /api/grades/:id
export const updateGrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!grade) { res.status(404).json({ success: false, message: 'Không tìm thấy điểm' }); return }
    await updateStudentStatus(String(grade.studentId))
    res.json({ success: true, data: grade })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/grades/bulk — import nhiều điểm cùng lúc
export const bulkImportGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { grades } = req.body as { grades: Record<string, unknown>[] }
    const ops = grades.map(g => ({
      updateOne: {
        filter: { studentId: g.studentId, subjectId: g.subjectId, semesterId: g.semesterId },
        update: { $set: g },
        upsert: true,
      }
    }))
    const result = await Grade.bulkWrite(ops)
    res.json({ success: true, message: `Import thành công ${result.upsertedCount + result.modifiedCount} bản ghi` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/grades/summary/:classId/:semesterId
export const getClassGradeSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, semesterId } = req.params
    const students = await Student.find({ classId })
    const summaries = await Promise.all(students.map(async (s) => {
      const grades = await Grade.find({ studentId: s._id, semesterId })
        .populate('subjectId', 'credits')
      const totalCredits = grades.reduce((a, g) => {
        const subj = g.subjectId as unknown as { credits: number }
        return a + (subj?.credits || 0)
      }, 0)
      const weightedSum = grades.reduce((a, g) => {
        const subj = g.subjectId as unknown as { credits: number }
        return a + g.score4 * (subj?.credits || 0)
      }, 0)
      const gpa4 = totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : 0
      return { student: s, gpa4, gpa10: parseFloat((gpa4 * 2.5).toFixed(2)), totalCredits }
    }))
    res.json({ success: true, data: summaries })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// Helper: cập nhật status SV dựa trên GPA
async function updateStudentStatus(studentId: string): Promise<void> {
  const grades = await Grade.find({ studentId }).populate('subjectId', 'credits')
  if (!grades.length) return
  const totalCredits = grades.reduce((a, g) => {
    const subj = g.subjectId as unknown as { credits: number }
    return a + (subj?.credits || 0)
  }, 0)
  const weightedSum = grades.reduce((a, g) => {
    const subj = g.subjectId as unknown as { credits: number }
    return a + g.score4 * (subj?.credits || 0)
  }, 0)
  const gpa4 = totalCredits > 0 ? weightedSum / totalCredits : 0
  let status: string = 'normal'
  if (gpa4 < 1.0)       status = 'warn3'
  else if (gpa4 < 1.5)  status = 'warn2'
  else if (gpa4 < 2.0)  status = 'warn1'
  await Student.findByIdAndUpdate(studentId, { status })
}
