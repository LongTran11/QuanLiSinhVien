import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

export type StudentStatus = 'normal' | 'warn1' | 'warn2' | 'warn3' | 'debt' | 'suspended'

export interface ClassAttributes {
  id: number
  name: string
  year: number
  advisorId: number
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface ClassCreationAttributes extends Optional<ClassAttributes, 'id' | 'isActive'> {}

class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  declare id: number
  declare name: string
  declare year: number
  declare advisorId: number
  declare isActive: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

Class.init({
  id:        { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name:      { type: DataTypes.STRING(100), allowNull: false, unique: true },
  year:      { type: DataTypes.INTEGER, allowNull: false },
  advisorId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  isActive:  { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  sequelize,
  tableName: 'classes',
})

export default Class
