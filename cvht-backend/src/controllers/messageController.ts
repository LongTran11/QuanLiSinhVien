import { Response } from 'express'
import { Message, Notification, User } from '../models'
import { AuthRequest } from '../middleware/auth'
import { Op } from 'sequelize'

// GET /api/messages/conversations — danh sách hội thoại
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = Number(req.user!.id)
    
    // This is more complex in SQL. We'll fetch recent messages and group in memory for simplicity like before.
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      order: [['createdAt', 'DESC']]
    })

    const convMap = new Map<number, any>()

    for (const msg of messages) {
      const partnerId = Number(msg.senderId) === userId ? Number(msg.receiverId) : Number(msg.senderId)

      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, {
          partnerId,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unread: (!msg.read && Number(msg.receiverId) === userId) ? 1 : 0,
        })
      } else {
        const conv = convMap.get(partnerId)!
        if (!msg.read && Number(msg.receiverId) === userId) conv.unread++
      }
    }

    const conversations = await Promise.all(
      Array.from(convMap.values()).map(async (conv) => {
        const partner = await User.findByPk(conv.partnerId, {
          attributes: ['name', 'email', 'role']
        })
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
    const userId = Number(req.user!.id)
    const partnerId = Number(req.params.partnerId)
    const { page = '1', limit = '50' } = req.query
    const offset = (parseInt(String(page)) - 1) * parseInt(String(limit))

    const { count, rows } = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ]
      },
      order: [['createdAt', 'ASC']],
      offset,
      limit: parseInt(String(limit))
    })

    // Đánh dấu đã đọc
    await Message.update(
      { read: true },
      { where: { senderId: partnerId, receiverId: userId, read: false } }
    )

    res.json({ success: true, data: rows, total: count })
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
      senderId: req.user!.id,
      receiverId: Number(receiverId),
      content,
    })
    
    // Tạo notification cho người nhận
    await Notification.create({
      userId: Number(receiverId),
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
    const count = await Message.count({ 
      where: { receiverId: req.user!.id, read: false } 
    })
    res.json({ success: true, count })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}
