import { Response } from 'express'
import Notification from '../models/Notification'
import { AuthRequest } from '../middleware/auth'

// GET /api/notifications
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifs = await Notification.find({ userId: req.user!._id }).sort({ createdAt: -1 }).limit(50)
    const unread = notifs.filter(n => !n.read).length
    res.json({ success: true, data: notifs, unread })
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Lỗi server' })
  }
}

// PUT /api/notifications/read-all
export const markAllRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany({ userId: req.user!._id, read: false }, { $set: { read: true } })
    res.json({ success: true, message: 'Đã đọc tất cả' })
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Lỗi server' })
  }
}

// PUT /api/notifications/:id/read
export const markRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user!._id }, { $set: { read: true } })
    res.json({ success: true })
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Lỗi server' })
  }
}
