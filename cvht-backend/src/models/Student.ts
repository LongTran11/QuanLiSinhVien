import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

export type StudentStatus = 'normal' | 'warn1' | 'warn2' | 'warn3' | 'debt' | 'suspended'

export interface StudentAttributes {
  id: number
  userId: number
  studentId: string
  classId: number
  name: string
  email: string
  phone: string
  dob: string
  address: string
  status: StudentStatus
  createdAt?: Date
  updatedAt?: Date
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id' | 'phone' | 'dob' | 'address' | 'status'> {}

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  declare id: number
  declare userId: number
  declare studentId: string
  declare classId: number
  declare name: string
  declare email: string
  declare phone: string
  declare dob: string
  declare address: string
  declare status: StudentStatus
  declare createdAt: Date
  declare updatedAt: Date
}

Student.init({
  id:        { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  studentId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  classId:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name:      { type: DataTypes.STRING(200), allowNull: false },
  email:     { type: DataTypes.STRING(200), allowNull: false },
  phone:     { type: DataTypes.STRING(20), defaultValue: '' },
  dob:       { type: DataTypes.STRING(20), defaultValue: '' },
  address:   { type: DataTypes.TEXT, defaultValue: '' },
  status:    { type: DataTypes.ENUM('normal','warn1','warn2','warn3','debt','suspended'), defaultValue: 'normal' },
}, {
  sequelize,
  tableName: 'students',
})

export default Student
