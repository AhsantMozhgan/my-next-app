import db from "../../utils/db"
import userItem from "../../data/users"
import User from "../../models/user"

async function handler(req, res) {
  try {
    await db.connect()

    await User.deleteMany({})
    await User.insertMany(userItem)
    res.status(200).send({ message: "user added" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export default handler