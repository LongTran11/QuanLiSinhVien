import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME || 'cvht_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle:    10000,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  }
)

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('✅ MySQL connected successfully')
    // Sync all models (alter: true to update schema without dropping data)
    await sequelize.sync({ alter: true })
    console.log('✅ All models synced with MySQL')
  } catch (error) {
    console.error('❌ MySQL connection error:', error)
    process.exit(1)
  }
}

export default sequelize
