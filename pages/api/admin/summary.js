import { getServerSession } from "next-auth/next"
import db from "../../../utils/db"
import Order from "../../../models/order"
import Product from "../../../models/product"
import User from "../../../models/user"
import { authOptions } from "../auth/[...nextauth]"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: "Sign in required" })
  }

  if (!session.user.isAdmin) {
    return res.status(403).json({ message: "Admin access only" })
  }

  try {
    await db.connect()

    const ordersCount = await Order.countDocuments()
    const productsCount = await Product.countDocuments()
    const usersCount = await User.countDocuments()

    const ordersPriceGroup = await Order.aggregate([
      { $group: { _id: null, sales: { $sum: "$totalPrice" } } },
    ])
    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.status(200).json({
      ordersCount,
      productsCount,
      usersCount,
      ordersPrice,
      salesData,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export default handler