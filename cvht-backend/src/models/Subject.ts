import mongoose, { Schema, Document } from 'mongoose'

export interface ISubject extends Document {
  _id: mongoose.Types.ObjectId
  code: string
  name: string
  credits: number
  department: string
  createdAt: Date
}

const SubjectSchema = new Schema<ISubject>({
  code:       { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  credits:    { type: Number, required: true, min: 1, max: 10 },
  department: { type: String, default: 'Khoa CNTT' },
}, { timestamps: true })

export default mongoose.model<ISubject>('Subject', SubjectSchema)
