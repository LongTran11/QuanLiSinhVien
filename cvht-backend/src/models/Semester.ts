import mongoose, { Schema, Document } from 'mongoose'

export interface ISemester extends Document {
  _id: mongoose.Types.ObjectId
  semesterId: string   // VD: HK1-2024
  name: string         // VD: HK1/2024
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: Date
}

const SemesterSchema = new Schema<ISemester>({
  semesterId: { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  startDate:  { type: String, required: true },
  endDate:    { type: String, required: true },
  isActive:   { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model<ISemester>('Semester', SemesterSchema)
