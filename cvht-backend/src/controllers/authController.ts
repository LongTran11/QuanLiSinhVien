import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'

const signToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions)

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, studentId } = req.body
    const existing = await User.findOne({ email })
    if (existing) {
      res.status(409).json({ success: false, message: 'Email đã được sử dụng' }); return
    }
    const user = await User.create({ name, email, password, role: role || 'student', studentId })
    const token = signToken(String(user._id), user.role)
    res.status(201).json({ success: true, token, user })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' }); return
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Email không tồn tại hoặc tài khoản bị khóa' }); return
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Mật khẩu không đúng' }); return
    }
    const token = signToken(String(user._id), user.role)
    const userObj = user.toJSON()
    res.json({ success: true, token, user: userObj })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, user: req.user })
}

// PUT /api/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id).select('+password')
    if (!user) { res.status(404).json({ success: false, message: 'Không tìm thấy user' }); return }
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) { res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' }); return }
    user.password = newPassword
    await user.save()
    res.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server'
    res.status(500).json({ success: false, message })
  }
}
