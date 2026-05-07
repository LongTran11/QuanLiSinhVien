import { Router } from 'express'
import { importStudents, importGrades, importSemesters, importSubjects } from '../controllers/databaseController'
import { protect, requireRole } from '../middleware/auth'

const router = Router()

router.use(protect)
router.use(requireRole('admin', 'cvht'))

router.post('/import/students',  importStudents)
router.post('/import/grades',    importGrades)
router.post('/import/semesters', importSemesters)
router.post('/import/subjects',  importSubjects)

export default router
