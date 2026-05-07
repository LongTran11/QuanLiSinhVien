import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

export interface MessageAttributes {
  id: number
  senderId: number
  receiverId: number
  content: string
  read: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'read'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  declare id: number
  declare senderId: number
  declare receiverId: number
  declare content: string
  declare read: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

Message.init({
  id:         { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  senderId:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  receiverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  content:    { type: DataTypes.STRING(2000), allowNull: false },
  read:       { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  tableName: 'messages',
  indexes: [
    { fields: ['senderId', 'receiverId', 'createdAt'] },
    { fields: ['receiverId', 'read'] }
  ]
})

export default Message
