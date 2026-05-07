import { Router } from 'express'
import { getPosts, createPost, toggleLike, addComment, deletePost } from '../controllers/forumController'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.get('/:classId',       getPosts)
router.post('/',              createPost)
router.put('/:id/like',       toggleLike)
router.post('/:id/comments',  addComment)
router.delete('/:id',         deletePost)

export default router
