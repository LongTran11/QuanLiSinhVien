import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

export interface SemesterAttributes {
  id: number
  semesterId: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface SemesterCreationAttributes extends Optional<SemesterAttributes, 'id' | 'isActive'> {}

class Semester extends Model<SemesterAttributes, SemesterCreationAttributes> implements SemesterAttributes {
  declare id: number
  declare semesterId: string
  declare name: string
  declare startDate: string
  declare endDate: string
  declare isActive: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

Semester.init({
  id:         { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  semesterId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name:       { type: DataTypes.STRING(100), allowNull: false },
  startDate:  { type: DataTypes.STRING(20), allowNull: false },
  endDate:    { type: DataTypes.STRING(20), allowNull: false },
  isActive:   { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  tableName: 'semesters',
})

export default Semester
