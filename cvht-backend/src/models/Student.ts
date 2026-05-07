import mongoose, { Schema, Document } from 'mongoose'

export type StudentStatus = 'normal' | 'warn1' | 'warn2' | 'warn3' | 'debt' | 'suspended'

export interface IStudent extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  studentId: string         // MSSV
  classId: mongoose.Types.ObjectId
  name: string
  email: string
  phone: string
  dob: string
  address: string
  status: StudentStatus
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<IStudent>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true },
  classId:   { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, default: '' },
  dob:       { type: String, default: '' },
  address:   { type: String, default: '' },
  status:    { type: String, enum: ['normal','warn1','warn2','warn3','debt','suspended'], default: 'normal' },
}, { timestamps: true })

export default mongoose.model<IStudent>('Student', StudentSchema)
