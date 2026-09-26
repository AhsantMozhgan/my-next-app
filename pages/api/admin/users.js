import { getServerSession } from "next-auth/next"
import db from "../../../utils/db"
import User from "../../../models/user"
import { authOptions } from "../auth/[...nextauth]"

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Sign in required" })
  }

  if (!session.user.isAdmin) {
    return res.status(403).json({ message: "Admin access only" })
  }

  if (req.method === "GET") {
    try {
      await db.connect()

      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .lean()

      return res.status(200).json(JSON.parse(JSON.stringify(users)))
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: err.message })
    }
  }

  if (req.method === "DELETE") {
    try {
      const { userId } = req.query

      if (!userId) {
        return res.status(400).json({ message: "User ID required" })
      }

      if (userId === session.user._id) {
        return res
          .status(400)
          .json({ message: "You cannot delete your own account" })
      }

      await db.connect()

      const deleted = await User.findByIdAndDelete(userId)

      if (!deleted) {
        return res.status(404).json({ message: "User not found" })
      }

      return res.status(200).json({ message: "User deleted" })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: err.message })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default handler