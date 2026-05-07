import mongoose, { Schema, Document } from 'mongoose'

export type NotifType = 'message' | 'forum' | 'grade' | 'system'

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  type: NotifType
  content: string
  link?: string
  read: boolean
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>({
  userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:    { type: String, enum: ['message','forum','grade','system'], required: true },
  content: { type: String, required: true },
  link:    { type: String },
  read:    { type: Boolean, default: false },
}, { timestamps: true })

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 })

export default mongoose.model<INotification>('Notification', NotificationSchema)
