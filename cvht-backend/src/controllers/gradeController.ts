import { Response } from 'express'
import { Grade, Student, Subject, Semester } from '../models'
import { AuthRequest } from '../middleware/auth'

// GET /api/grades?classId=&semesterId=
export const getGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, semesterId, studentId } = req.query
    const where: any = {}
    if (classId)   where.classId   = classId
    if (semesterId) where.semesterId = semesterId
    if (studentId)  where.studentId  = studentId
    
    const grades = await Grade.findAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['name', 'studentId'] },
        { model: Subject, as: 'subject', attributes: ['name', 'code', 'credits'] },
        { model: Semester, as: 'semester', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    })
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
    await updateStudentStatus(Number(grade.studentId))
    res.status(201).json({ success: true, data: grade })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    // Sequelize unique constraint error check might be needed here
    res.status(500).json({ success: false, message })
  }
}

// PUT /api/grades/:id
export const updateGrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const grade = await Grade.findByPk(req.params.id)
    if (!grade) { res.status(404).json({ success: false, message: 'Không tìm thấy điểm' }); return }
    await grade.update(req.body)
    await updateStudentStatus(Number(grade.studentId))
    res.json({ success: true, data: grade })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/grades/bulk — import nhiều điểm cùng lúc
export const bulkImportGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { grades } = req.body as { grades: any[] }
    // Sequelize bulkCreate with updateOnDuplicate or individual upserts
    const results = await Promise.all(grades.map(g => 
      Grade.upsert(g)
    ))
    res.json({ success: true, message: `Import thành công ${results.length} bản ghi` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/grades/summary/:classId/:semesterId
export const getClassGradeSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, semesterId } = req.params
    const students = await Student.findAll({ where: { classId: Number(classId) } })
    const summaries = await Promise.all(students.map(async (s) => {
      const grades = await Grade.findAll({ 
        where: { studentId: s.id, semesterId: Number(semesterId) },
        include: [{ model: Subject, as: 'subject', attributes: ['credits'] }]
      })
      const totalCredits = grades.reduce((a, g) => {
        const subj = g.get('subject') as any
        return a + (subj?.credits || 0)
      }, 0)
      const weightedSum = grades.reduce((a, g) => {
        const subj = g.get('subject') as any
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
async function updateStudentStatus(studentId: number): Promise<void> {
  const grades = await Grade.findAll({ 
    where: { studentId },
    include: [{ model: Subject, as: 'subject', attributes: ['credits'] }]
  })
  if (!grades.length) return
  const totalCredits = grades.reduce((a, g) => {
    const subj = g.get('subject') as any
    return a + (subj?.credits || 0)
  }, 0)
  const weightedSum = grades.reduce((a, g) => {
    const subj = g.get('subject') as any
    return a + g.score4 * (subj?.credits || 0)
  }, 0)
  const gpa4 = totalCredits > 0 ? weightedSum / totalCredits : 0
  let status: string = 'normal'
  if (gpa4 < 1.0)       status = 'warn3'
  else if (gpa4 < 1.5)  status = 'warn2'
  else if (gpa4 < 2.0)  status = 'warn1'
  await Student.update({ status: status as any }, { where: { id: studentId } })
}
