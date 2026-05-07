import { Router } from 'express'
import { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getStudentGrades } from '../controllers/studentController'
import { protect, requireRole } from '../middleware/auth'

const router = Router()

router.use(protect)
router.get('/',              getStudents)
router.get('/:id',           getStudent)
router.post('/',             requireRole('cvht','admin'), createStudent)
router.put('/:id',           requireRole('cvht','admin'), updateStudent)
router.delete('/:id',        requireRole('cvht','admin'), deleteStudent)
router.get('/:id/grades',    getStudentGrades)

export default router
