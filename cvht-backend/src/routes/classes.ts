import { Router } from 'express'
import { getClasses, createClass, getClassStats } from '../controllers/classController'
import { protect, requireRole } from '../middleware/auth'

const router = Router()

router.use(protect)
router.get('/',             getClasses)
router.post('/',            requireRole('cvht','admin'), createClass)
router.get('/:id/stats',   getClassStats)

export default router
