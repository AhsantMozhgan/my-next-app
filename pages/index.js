import Layout from "../components/Layout"
import ProductItem from "../components/ProductItem"
import db from "../utils/db"
import Product from "../models/product"

function Home({ products }) {
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
        {products.map((pItem) => (
          <ProductItem item={pItem} key={pItem.slug} />
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find({}).lean()
  // No db.disconnect() here — cached connection is reused across requests

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  }
}

export default Home