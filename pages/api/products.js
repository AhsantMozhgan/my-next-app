import db from "../../utils/db"
import products from "../../data/products"
import Product from "../../models/product"

async function handler(req, res) {
  try {
    await db.connect()

    await Product.deleteMany({})
    await Product.insertMany(products)
    res.status(200).send({ message: "products added" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export default handler