import { getServerSession } from "next-auth/next"
import db from "../../../utils/db"
import Order from "../../../models/order"
// import { authOptions } from "../auth/[...nextauth]"

async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" })
//   }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: "Sign in required" })
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body

  if (!orderItems?.length) {
    return res.status(400).json({ message: "No order items" })
  }

  try {
    await db.connect()

    const newOrder = new Order({
      user: session.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })

    const savedOrder = await newOrder.save()

    res.status(201).json(savedOrder)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export default handler
