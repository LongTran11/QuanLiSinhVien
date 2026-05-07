import mongoose, { Schema, Document } from 'mongoose'

export interface IClass extends Document {
  _id: mongoose.Types.ObjectId
  name: string          // VD: K23-CNTT-01
  year: number          // Khóa học VD: 2022
  advisorId: mongoose.Types.ObjectId   // CVHT
  students: mongoose.Types.ObjectId[]  // Danh sách SV
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ClassSchema = new Schema<IClass>({
  name:      { type: String, required: true, unique: true, trim: true },
  year:      { type: Number, required: true },
  advisorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students:  [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isActive:  { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model<IClass>('Class', ClassSchema)
