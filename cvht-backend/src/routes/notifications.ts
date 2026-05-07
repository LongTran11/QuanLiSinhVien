import { Router } from 'express'
import { getNotifications, markAllRead, markRead } from '../controllers/notificationController'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.get('/',              getNotifications)
router.put('/read-all',      markAllRead)
router.put('/:id/read',      markRead)

export default router
