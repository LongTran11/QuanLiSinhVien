import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'
import bcrypt from 'bcryptjs'

export type UserRole = 'cvht' | 'student' | 'admin'

export interface UserAttributes {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  studentId?: string
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number
  declare name: string
  declare email: string
  declare password: string
  declare role: UserRole
  declare studentId: string | undefined
  declare phone: string | undefined
  declare avatar: string | undefined
  declare isActive: boolean
  declare createdAt: Date
  declare updatedAt: Date

  async comparePassword(candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password)
  }

  toSafeJSON() {
    const { password: _p, ...rest } = this.toJSON() as UserAttributes
    return rest
  }
}

User.init({
  id:        { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name:      { type: DataTypes.STRING(200), allowNull: false },
  email:     { type: DataTypes.STRING(200), allowNull: false, unique: true },
  password:  { type: DataTypes.STRING(200), allowNull: false },
  role:      { type: DataTypes.ENUM('cvht', 'student', 'admin'), defaultValue: 'student' },
  studentId: { type: DataTypes.STRING(50), unique: true, allowNull: true },
  phone:     { type: DataTypes.STRING(20), allowNull: true },
  avatar:    { type: DataTypes.TEXT, allowNull: true },
  isActive:  { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  sequelize,
  tableName: 'users',
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12)
      }
    },
  },
})

export default User
