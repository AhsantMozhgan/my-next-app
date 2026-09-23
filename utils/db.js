import mongoose from "mongoose"

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/shopping")
    console.log("Connected to MongoDB")
  } catch (err) {
    console.error("MongoDB connection error:", err.message)
    throw err
  }
}

const db = { connect }
export default db