import { Response } from 'express'
import Message from '../models/Message'
import Notification from '../models/Notification'
import { AuthRequest } from '../middleware/auth'
import mongoose from 'mongoose'

// GET /api/messages/conversations — danh sách hội thoại
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id
    // Lấy tất cả message liên quan đến user hiện tại
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 })

    // Group by partner
    const convMap = new Map<string, {
      partnerId: string
      lastMessage: string
      lastTime: Date
      unread: number
    }>()

    for (const msg of messages) {
      const partnerId = String(msg.senderId) === String(userId)
        ? String(msg.receiverId)
        : String(msg.senderId)

      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, {
          partnerId,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unread: (!msg.read && String(msg.receiverId) === String(userId)) ? 1 : 0,
        })
      } else {
        const conv = convMap.get(partnerId)!
        if (!msg.read && String(msg.receiverId) === String(userId)) conv.unread++
      }
    }

    // Populate partner info
    const User = (await import('../models/User')).default
    const conversations = await Promise.all(
      Array.from(convMap.values()).map(async (conv) => {
        const partner = await User.findById(conv.partnerId).select('name email role')
        return { ...conv, partner }
      })
    )

    res.json({ success: true, data: conversations })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/messages/:partnerId — lấy lịch sử chat với 1 người
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id
    const { partnerId } = req.params
    const { page = '1', limit = '50' } = req.query
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit))

    const [messages, total] = await Promise.all([
      Message.find({
        $or: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ]
      }).sort({ createdAt: 1 }).skip(skip).limit(parseInt(String(limit))),
      Message.countDocuments({
        $or: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ]
      })
    ])

    // Đánh dấu đã đọc
    await Message.updateMany(
      { senderId: partnerId, receiverId: userId, read: false },
      { $set: { read: true } }
    )

    res.json({ success: true, data: messages, total })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/messages — gửi tin nhắn
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, content } = req.body
    const message = await Message.create({
      senderId: req.user!._id,
      receiverId,
      content,
    })
    // Tạo notification cho người nhận
    await Notification.create({
      userId: receiverId,
      type: 'message',
      content: `${req.user!.name} đã gửi tin nhắn cho bạn`,
      link: '/messages',
    })
    res.status(201).json({ success: true, data: message })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/messages/unread-count
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await Message.countDocuments({ receiverId: req.user!._id, read: false })
    res.json({ success: true, count })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}
