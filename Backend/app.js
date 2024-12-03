const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 2007
const cors = require('cors')
const connectDB = require('./DB/Connect')
const router = require('./Routes/Route')

app.use(cors())
app.use(express.json())

app.use('/', router)

const start = () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port} aaaa`)
    })
    connectDB()
}

start()


