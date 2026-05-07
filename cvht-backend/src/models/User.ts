import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserRole = 'cvht' | 'student' | 'admin'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  studentId?: string        // MSSV (nếu là sinh viên)
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['cvht', 'student', 'admin'], default: 'student' },
  studentId: { type: String, unique: true, sparse: true },
  phone:     { type: String },
  avatar:    { type: String },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true })

// Hash password trước khi save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

// Ẩn password khi trả về JSON
UserSchema.set('toJSON', {
  transform: (_doc, ret) => { const { password: _p, ...rest } = ret; return rest }
})

export default mongoose.model<IUser>('User', UserSchema)
