import mongoose, { Schema, Document } from 'mongoose'

export interface IGrade extends Document {
  _id: mongoose.Types.ObjectId
  studentId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  semesterId: mongoose.Types.ObjectId
  classId: mongoose.Types.ObjectId
  score10: number
  score4: number
  letterGrade: string
  midScore: number
  finalScore: number
  createdAt: Date
  updatedAt: Date
}

function score10to4(s: number): number {
  if (s >= 9.0) return 4.0
  if (s >= 8.5) return 3.7
  if (s >= 8.0) return 3.5
  if (s >= 7.5) return 3.2
  if (s >= 7.0) return 3.0
  if (s >= 6.5) return 2.5
  if (s >= 6.0) return 2.0
  if (s >= 5.5) return 1.5
  if (s >= 5.0) return 1.0
  return 0.0
}

function score10toLetter(s: number): string {
  if (s >= 9.0) return 'A+'
  if (s >= 8.5) return 'A'
  if (s >= 8.0) return 'B+'
  if (s >= 7.5) return 'B'
  if (s >= 7.0) return 'C+'
  if (s >= 6.5) return 'C'
  if (s >= 6.0) return 'D+'
  if (s >= 5.0) return 'D'
  return 'F'
}

const GradeSchema = new Schema<IGrade>({
  studentId:  { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  subjectId:  { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  semesterId: { type: Schema.Types.ObjectId, ref: 'Semester', required: true },
  classId:    { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  midScore:   { type: Number, min: 0, max: 10, default: 0 },
  finalScore: { type: Number, min: 0, max: 10, default: 0 },
  score10:    { type: Number, min: 0, max: 10, default: 0 },
  score4:     { type: Number, min: 0, max: 4, default: 0 },
  letterGrade:{ type: String, default: 'F' },
}, { timestamps: true })

// Unique: 1 SV chỉ có 1 điểm / môn / kỳ
GradeSchema.index({ studentId: 1, subjectId: 1, semesterId: 1 }, { unique: true })

// Tự tính score4 và letterGrade từ score10
GradeSchema.pre('save', function (next) {
  if (this.isModified('score10') || this.isModified('midScore') || this.isModified('finalScore')) {
    if (this.midScore || this.finalScore) {
      this.score10 = parseFloat((this.midScore * 0.4 + this.finalScore * 0.6).toFixed(2))
    }
    this.score4      = score10to4(this.score10)
    this.letterGrade = score10toLetter(this.score10)
  }
  next()
})

export default mongoose.model<IGrade>('Grade', GradeSchema)
