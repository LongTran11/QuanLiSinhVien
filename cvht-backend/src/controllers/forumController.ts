import { Response } from 'express'
import { ForumPost, Notification, Class, User, Student } from '../models'
import { AuthRequest } from '../middleware/auth'

// GET /api/forum/:classId
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params
    const { page = '1', limit = '20' } = req.query
    const offset = (parseInt(String(page)) - 1) * parseInt(String(limit))
    
    const { count, rows } = await ForumPost.findAndCountAll({
      where: { classId: Number(classId) },
      order: [['isPinned', 'DESC'], ['createdAt', 'DESC']],
      offset,
      limit: parseInt(String(limit))
    })
    
    res.json({ success: true, data: rows, total: count })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/forum
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, content } = req.body
    const post = await ForumPost.create({
      classId: Number(classId),
      authorId: req.user!.id,
      authorName: req.user!.name,
      authorRole: req.user!.role,
      content,
    })
    
    // Thông báo cho thành viên trong lớp
    const cls = await Class.findByPk(classId, {
      include: [{ model: Student, as: 'students', attributes: ['userId'] }]
    })
    
    if (cls) {
      const students = (cls as any).students || []
      const notifRecipients = students.filter(
        (s: any) => Number(s.userId) !== Number(req.user!.id)
      )
      
      await Notification.bulkCreate(notifRecipients.map((s: any) => ({
        userId: s.userId,
        type: 'forum',
        content: `${req.user!.name} đã đăng bài mới trong lớp`,
        link: '/forum',
      })))
    }
    res.status(201).json({ success: true, data: post })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// PUT /api/forum/:id/like
export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await ForumPost.findByPk(req.params.id)
    if (!post) { res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' }); return }
    
    const userId = Number(req.user!.id)
    let likes = [...(post.likes || [])]
    const likedIndex = likes.indexOf(userId)
    
    if (likedIndex !== -1) {
      likes.splice(likedIndex, 1)
    } else {
      likes.push(userId)
    }
    
    await post.update({ likes })
    res.json({ success: true, likes: likes.length, liked: likedIndex === -1 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/forum/:id/comments
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await ForumPost.findByPk(req.params.id)
    if (!post) { res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' }); return }
    
    const comment = {
      id: Date.now(), // Simple unique ID for comment
      authorId: Number(req.user!.id),
      authorName: req.user!.name,
      content: req.body.content,
      createdAt: new Date(),
    }
    
    let comments = [...(post.comments || [])]
    comments.push(comment)
    
    await post.update({ comments })
    res.status(201).json({ success: true, data: comment })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// DELETE /api/forum/:id
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await ForumPost.findByPk(req.params.id)
    if (!post) { res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' }); return }
    
    if (Number(post.authorId) !== Number(req.user!.id) && req.user!.role !== 'cvht') {
      res.status(403).json({ success: false, message: 'Không có quyền xóa bài viết này' }); return
    }
    
    await post.destroy()
    res.json({ success: true, message: 'Đã xóa bài viết' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}
