import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopping"

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

async function disconnect() {
  if (cached.conn) {
    await cached.conn.disconnect()
    cached.conn = null
    cached.promise = null
  }
}


const db = { connect, disconnect }
export default db