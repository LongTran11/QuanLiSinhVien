import { Response } from 'express'
import ForumPost from '../models/ForumPost'
import Notification from '../models/Notification'
import Class from '../models/Class'
import { AuthRequest } from '../middleware/auth'
import mongoose from 'mongoose'

// GET /api/forum/:classId
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params
    const { page = '1', limit = '20' } = req.query
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit))
    const [posts, total] = await Promise.all([
      ForumPost.find({ classId }).sort({ isPinned: -1, createdAt: -1 }).skip(skip).limit(parseInt(String(limit))),
      ForumPost.countDocuments({ classId }),
    ])
    res.json({ success: true, data: posts, total })
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
      classId,
      authorId: req.user!._id,
      authorName: req.user!.name,
      authorRole: req.user!.role,
      content,
    })
    // Thông báo cho thành viên trong lớp
    const cls = await Class.findById(classId).populate('students', '_id')
    if (cls) {
      const notifRecipients = cls.students.filter(
        (s: unknown) => String((s as { _id: mongoose.Types.ObjectId })._id) !== String(req.user!._id)
      )
      await Notification.insertMany(notifRecipients.map((s: unknown) => ({
        userId: (s as { _id: mongoose.Types.ObjectId })._id,
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
    const post = await ForumPost.findById(req.params.id)
    if (!post) { res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' }); return }
    const userId = req.user!._id as mongoose.Types.ObjectId
    const liked = post.likes.some(id => String(id) === String(userId))
    if (liked) {
      post.likes = post.likes.filter(id => String(id) !== String(userId))
    } else {
      post.likes.push(userId)
    }
    await post.save()
    res.json({ success: true, likes: post.likes.length, liked: !liked })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/forum/:id/comments
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await ForumPost.findById(req.params.id)
    if (!post) { res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' }); return }
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      authorId: req.user!._id as mongoose.Types.ObjectId,
      authorName: req.user!.name,
      content: req.body.content,
      createdAt: new Date(),
    }
    post.comments.push(comment)
    await post.save()
    res.status(201).json({ success: true, data: comment })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// DELETE /api/forum/:id
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await ForumPost.findById(req.params.id)
    if (!post) { res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' }); return }
    if (String(post.authorId) !== String(req.user!._id) && req.user!.role !== 'cvht') {
      res.status(403).json({ success: false, message: 'Không có quyền xóa bài viết này' }); return
    }
    await post.deleteOne()
    res.json({ success: true, message: 'Đã xóa bài viết' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}
