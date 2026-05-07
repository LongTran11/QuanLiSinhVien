import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  content: string
  read: boolean
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>({
  senderId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content:    { type: String, required: true, maxlength: 2000 },
  read:       { type: Boolean, default: false },
}, { timestamps: true })

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 })
MessageSchema.index({ receiverId: 1, read: 1 })

export default mongoose.model<IMessage>('Message', MessageSchema)
