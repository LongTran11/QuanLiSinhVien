import { Router } from 'express'
import { getConversations, getMessages, sendMessage, getUnreadCount } from '../controllers/messageController'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.get('/conversations',  getConversations)
router.get('/unread-count',   getUnreadCount)
router.get('/:partnerId',     getMessages)
router.post('/',              sendMessage)

export default router
