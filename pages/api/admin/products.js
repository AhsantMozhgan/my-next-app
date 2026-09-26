import { getServerSession } from "next-auth/next"
import db from "../../../utils/db"
import Product from "../../../models/product"
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
      const products = await Product.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(JSON.parse(JSON.stringify(products)))
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: err.message })
    }
  }

  if (req.method === "POST") {
    try {
      await db.connect()

      const { title, slug, price, image, description, category, count } =
        req.body

      if (!title || !slug || !price || !image || !description || !category) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      const existing = await Product.findOne({ slug })
      if (existing) {
        return res.status(409).json({ message: "Slug already in use" })
      }

      const newProduct = new Product({
        title,
        slug,
        price,
        image,
        description,
        category,
        count: count ?? 0,
      })

      const savedProduct = await newProduct.save()
      return res.status(201).json(savedProduct)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: err.message })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default handler