import { Router } from 'express'
import { getGrades, createGrade, updateGrade, bulkImportGrades, getClassGradeSummary } from '../controllers/gradeController'
import { protect, requireRole } from '../middleware/auth'

const router = Router()

router.use(protect)
router.get('/',                                   getGrades)
router.post('/',                                  requireRole('cvht','admin'), createGrade)
router.put('/:id',                                requireRole('cvht','admin'), updateGrade)
router.post('/bulk',                              requireRole('cvht','admin'), bulkImportGrades)
router.get('/summary/:classId/:semesterId',       getClassGradeSummary)

export default router
