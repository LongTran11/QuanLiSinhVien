import User from './User'
import Class from './Class'
import Student from './Student'
import Grade from './Grade'
import Semester from './Semester'
import Subject from './Subject'
import ForumPost from './ForumPost'
import Message from './Message'
import Notification from './Notification'

// Setup Associations

// User <-> Class (Advisor)
User.hasMany(Class, { foreignKey: 'advisorId', as: 'advisedClasses' })
Class.belongsTo(User, { foreignKey: 'advisorId', as: 'advisor' })

// Class <-> Student
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' })
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' })

// User <-> Student
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' })
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Grade <-> Student
Student.hasMany(Grade, { foreignKey: 'studentId', as: 'grades' })
Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'student' })

// Grade <-> Subject
Subject.hasMany(Grade, { foreignKey: 'subjectId', as: 'grades' })
Grade.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' })

// Grade <-> Semester
Semester.hasMany(Grade, { foreignKey: 'semesterId', as: 'grades' })
Grade.belongsTo(Semester, { foreignKey: 'semesterId', as: 'semester' })

// Grade <-> Class
Class.hasMany(Grade, { foreignKey: 'classId', as: 'grades' })
Grade.belongsTo(Class, { foreignKey: 'classId', as: 'class' })

export {
  User,
  Class,
  Student,
  Grade,
  Semester,
  Subject,
  ForumPost,
  Message,
  Notification
}
