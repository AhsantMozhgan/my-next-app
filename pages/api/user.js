import db from "../../utils/db"
import userItem from "../../data/users"
import User from "../../models/user"

async function handler(req, res) {
  // try {
    await db.connect()

    // const existing = await User.countDocuments()
    // if (existing > 0) {
    //   return res.status(200).json({ message: "Users already seeded" })
    // }

    await User.deleteMany({})
    await User.insertMany(userItem)
    res.send({ message: "user added" })
  // } catch (err) {
  //   console.error(err)
  //   res.status(500).json({ message: err.message })
  // }
}

export default handler
