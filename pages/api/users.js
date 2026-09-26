import db from "../../utils/db"
import userItem from "../../data/users"
import User from "../../models/user"

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    await db.connect()
    await User.deleteMany({})
    await User.insertMany(userItem)
    res.status(201).json({ message: `Seeded ${userItem.length} users` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export default handler