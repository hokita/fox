// Load environment variables from .env file FIRST
import dotenv from 'dotenv'
dotenv.config()

import app from './presentation/app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
