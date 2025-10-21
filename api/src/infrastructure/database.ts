import mysql from 'mysql2/promise'

const [host, port] = process.env.DB_ENDPOINT!.split(':')

const pool = mysql.createPool({
  host,
  port: Number.parseInt(port),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
