const mongoose = require('mongoose')
const connectionString = process.env.MONGODB_URI

const connectDB = () => {
    mongoose.connect(connectionString)
        .then(() => console.log("Connected to DB"))
}

module.exports = connectDB