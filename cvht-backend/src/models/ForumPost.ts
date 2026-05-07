import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

// Cho comments, với MySQL ta có thể tạo bảng Comment riêng hoặc dùng kiểu JSON/JSONB.
// Để đơn giản, ta sẽ lưu `comments` dạng JSON, giống với cách lưu sub-document của MongoDB.
// Nếu muốn chuẩn hóa, nên tạo một model Comment riêng.
// Tuy nhiên để giảm thiểu thay đổi logic ở controller, ta dùng kiểu JSON.

export interface CommentAttributes {
  id?: number | string // Mongoose dùng ObjectId, ở đây ta có thể sinh chuỗi hoặc số ngẫu nhiên nếu cần, nhưng dùng auto-increment hoặc UUID là tốt nhất.
  authorId: number
  authorName: string
  content: string
  createdAt?: Date
}

export interface ForumPostAttributes {
  id: number
  classId: number
  authorId: number
  authorName: string
  authorRole: string
  content: string
  likes: number[] // Lưu dạng mảng JSON các user IDs
  comments: CommentAttributes[] // Lưu dạng mảng JSON các comments
  isPinned: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface ForumPostCreationAttributes extends Optional<ForumPostAttributes, 'id' | 'likes' | 'comments' | 'isPinned'> {}

class ForumPost extends Model<ForumPostAttributes, ForumPostCreationAttributes> implements ForumPostAttributes {
  declare id: number
  declare classId: number
  declare authorId: number
  declare authorName: string
  declare authorRole: string
  declare content: string
  declare likes: number[]
  declare comments: CommentAttributes[]
  declare isPinned: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

ForumPost.init({
  id:         { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  classId:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  authorId:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  authorName: { type: DataTypes.STRING(200), allowNull: false },
  authorRole: { type: DataTypes.ENUM('cvht', 'student'), allowNull: false },
  content:    { type: DataTypes.TEXT, allowNull: false },
  likes:      { type: DataTypes.JSON, defaultValue: [] },
  comments:   { type: DataTypes.JSON, defaultValue: [] },
  isPinned:   { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  tableName: 'forum_posts',
  indexes: [
    { fields: ['classId', 'createdAt'] }
  ]
})

export default ForumPost
