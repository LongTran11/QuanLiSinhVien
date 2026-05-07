import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import './models' // Initialize models and associations
import { errorHandler, notFound } from './middleware/errorHandler'

import authRoutes         from './routes/auth'
import studentRoutes      from './routes/students'
import gradeRoutes        from './routes/grades'
import forumRoutes        from './routes/forum'
import messageRoutes      from './routes/messages'
import classRoutes        from './routes/classes'
import notificationRoutes from './routes/notifications'
import miscRoutes         from './routes/semesters'
import databaseRoutes     from './routes/database'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logger (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

// ── Routes ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'CVHT API is running 🚀', timestamp: new Date() })
})

app.use('/api/auth',          authRoutes)
app.use('/api/students',      studentRoutes)
app.use('/api/grades',        gradeRoutes)
app.use('/api/forum',         forumRoutes)
app.use('/api/messages',      messageRoutes)
app.use('/api/classes',       classRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/database',      databaseRoutes)
app.use('/api',               miscRoutes)

// ── 404 & Error Handler ────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ──────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 CVHT Backend running on http://localhost:${PORT}`)
    console.log(`📖 Health check: http://localhost:${PORT}/api/health`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`)
  })
})

export default app
