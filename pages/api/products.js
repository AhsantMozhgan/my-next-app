import db from "../../utils/db"
import products from "../../data/products"
import Product from "../../models/product"

async function handler(req, res) {
  // try {
    await db.connect()

    // const existing = await Product.countDocuments()
    // if (existing > 0) {
    //   return res.status(200).json({ message: "Products already seeded" })
    // }

    await Product.deleteMany({})
    await Product.insertMany(products)
    res.send({ message: "products added" })
  // } catch (err) {
  //   console.error(err)
  //   res.status(500).json({ message: err.message })
  // }
}

export default handler