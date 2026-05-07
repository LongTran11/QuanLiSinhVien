import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

export type NotifType = 'message' | 'forum' | 'grade' | 'system'

export interface NotificationAttributes {
  id: number
  userId: number
  type: NotifType
  content: string
  link?: string
  read: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'link' | 'read'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  declare id: number
  declare userId: number
  declare type: NotifType
  declare content: string
  declare link: string | undefined
  declare read: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

Notification.init({
  id:      { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type:    { type: DataTypes.ENUM('message', 'forum', 'grade', 'system'), allowNull: false },
  content: { type: DataTypes.STRING(1000), allowNull: false },
  link:    { type: DataTypes.STRING(500), allowNull: true },
  read:    { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  tableName: 'notifications',
  indexes: [
    { fields: ['userId', 'read', 'createdAt'] }
  ]
})

export default Notification
