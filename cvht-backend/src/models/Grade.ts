import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database'

export interface GradeAttributes {
  id: number
  studentId: number
  subjectId: number
  semesterId: number
  classId: number
  midScore: number
  finalScore: number
  score10: number
  score4: number
  letterGrade: string
  createdAt?: Date
  updatedAt?: Date
}

interface GradeCreationAttributes extends Optional<GradeAttributes, 'id' | 'midScore' | 'finalScore' | 'score10' | 'score4' | 'letterGrade'> { }

export function score10to4(s: number): number {
  if (s >= 9.0) return 4.0
  if (s >= 8.5) return 3.7
  if (s >= 8.0) return 3.5
  if (s >= 7.5) return 3.2
  if (s >= 7.0) return 3.0
  if (s >= 6.5) return 2.5
  if (s >= 6.0) return 2.0
  if (s >= 5.5) return 1.5
  if (s >= 5.0) return 1.0
  return 0.0
}

export function score10toLetter(s: number): string {
  if (s >= 9.0) return 'A+'
  if (s >= 8.5) return 'A'
  if (s >= 8.0) return 'B+'
  if (s >= 7.5) return 'B'
  if (s >= 7.0) return 'C+'
  if (s >= 6.5) return 'C'
  if (s >= 6.0) return 'D+'
  if (s >= 5.0) return 'D'
  return 'F'
}

class Grade extends Model<GradeAttributes, GradeCreationAttributes> implements GradeAttributes {
  declare id: number
  declare studentId: number
  declare subjectId: number
  declare semesterId: number
  declare classId: number
  declare midScore: number
  declare finalScore: number
  declare score10: number
  declare score4: number
  declare letterGrade: string
  declare createdAt: Date
  declare updatedAt: Date
}

Grade.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  studentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  subjectId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  semesterId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  classId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  midScore: { type: DataTypes.FLOAT, defaultValue: 0 },
  finalScore: { type: DataTypes.FLOAT, defaultValue: 0 },
  score10: { type: DataTypes.FLOAT, defaultValue: 0 },
  score4: { type: DataTypes.FLOAT, defaultValue: 0 },
  letterGrade: { type: DataTypes.STRING(5), defaultValue: 'F' },
}, {
  sequelize,
  tableName: 'grades',
  indexes: [{ unique: true, fields: ['studentId', 'subjectId', 'semesterId'] }],
  hooks: {
    beforeSave: (grade) => {
      if (grade.changed('midScore') || grade.changed('finalScore') || grade.changed('score10')) {
        if (grade.midScore || grade.finalScore) {
          grade.score10 = parseFloat((grade.midScore * 0.4 + grade.finalScore * 0.6).toFixed(2))
        }
        grade.score4 = score10to4(grade.score10)
        grade.letterGrade = score10toLetter(grade.score10)
      }
    },
  },
})

export default Grade
