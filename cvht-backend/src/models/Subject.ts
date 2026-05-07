import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

export interface SubjectAttributes {
  id: number
  code: string
  name: string
  credits: number
  department: string
  createdAt?: Date
  updatedAt?: Date
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id' | 'department'> {}

class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  declare id: number
  declare code: string
  declare name: string
  declare credits: number
  declare department: string
  declare createdAt: Date
  declare updatedAt: Date
}

Subject.init({
  id:         { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  code:       { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name:       { type: DataTypes.STRING(200), allowNull: false },
  credits:    { type: DataTypes.INTEGER, allowNull: false },
  department: { type: DataTypes.STRING(200), defaultValue: 'Khoa CNTT' },
}, {
  sequelize,
  tableName: 'subjects',
})

export default Subject
