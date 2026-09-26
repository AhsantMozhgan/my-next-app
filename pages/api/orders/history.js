import { getServerSession } from "next-auth/next"
import db from "../../../utils/db"
import Order from "../../../models/order"
import { authOptions } from "../auth/[...nextauth]"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: "Sign in required" })
  }

  try {
    await db.connect()

    const orders = await Order.find({ user: session.user._id }).lean()

    res.status(200).json(JSON.parse(JSON.stringify(orders)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export default handler