import { Router } from 'express'
import Semester from '../models/Semester'
import Subject from '../models/Subject'
import { protect, requireRole } from '../middleware/auth'
import { Request, Response } from 'express'

const router = Router()
router.use(protect)

router.get('/semesters', async (_req: Request, res: Response) => {
  const data = await Semester.find().sort({ semesterId: -1 })
  res.json({ success: true, data })
})
router.post('/semesters', requireRole('admin','cvht'), async (req: Request, res: Response) => {
  const data = await Semester.create(req.body)
  res.status(201).json({ success: true, data })
})
router.get('/subjects', async (_req: Request, res: Response) => {
  const data = await Subject.find().sort({ code: 1 })
  res.json({ success: true, data })
})
router.post('/subjects', requireRole('admin','cvht'), async (req: Request, res: Response) => {
  const data = await Subject.create(req.body)
  res.status(201).json({ success: true, data })
})

export default router
