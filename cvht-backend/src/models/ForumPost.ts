import mongoose, { Schema, Document } from 'mongoose'

export interface IComment {
  _id: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  authorName: string
  content: string
  createdAt: Date
}

export interface IForumPost extends Document {
  _id: mongoose.Types.ObjectId
  classId: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  authorName: string
  authorRole: string
  content: string
  likes: mongoose.Types.ObjectId[]
  comments: IComment[]
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>({
  authorId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  content:    { type: String, required: true },
  createdAt:  { type: Date, default: Date.now },
})

const ForumPostSchema = new Schema<IForumPost>({
  classId:    { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  authorId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, enum: ['cvht', 'student'], required: true },
  content:    { type: String, required: true, maxlength: 5000 },
  likes:      [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments:   [CommentSchema],
  isPinned:   { type: Boolean, default: false },
}, { timestamps: true })

ForumPostSchema.index({ classId: 1, createdAt: -1 })

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema)
