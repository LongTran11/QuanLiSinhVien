import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  code?: number
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Lỗi server'

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409
    message = 'Dữ liệu đã tồn tại (trùng lặp)'
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Dữ liệu không hợp lệ: ' + err.message
  }

  // JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Token không hợp lệ'
  }

  console.error(`[${new Date().toISOString()}] ${statusCode} — ${message}`)

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: 'API endpoint không tồn tại' })
}
