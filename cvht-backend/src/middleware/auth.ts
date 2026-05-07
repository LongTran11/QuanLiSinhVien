import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

export interface AuthRequest extends Request {
  user?: IUser
}

interface JwtPayload { id: string; role: string }

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' }); return
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload
    const user = await User.findById(decoded.id).select('-password')
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Token không hợp lệ' }); return
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Token hết hạn hoặc không hợp lệ' })
  }
}

export const requireRole = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ success: false, message: 'Không có quyền truy cập' }); return
  }
  next()
}
