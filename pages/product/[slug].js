import { useRouter } from "next/router"
import Image from "next/image"
import { useContext } from "react"
import Layout from "../../components/Layout"
import db from "../../utils/db"
import Product from "../../models/product"
import { Store } from "../../context/Cart"

function ProductPage({ product }) {
  const { state, dispatch } = useContext(Store)
  const router = useRouter()

  function addToCartHandler() {
    const existingItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    )
    const quantity = existingItem ? existingItem.quantity + 1 : 1

    // if (product.count < quantity) {
    //   alert("Sorry. Product is out of stock")
    //   return
    // }

    dispatch({
      type: "ADD_ITEM",
      payload: { ...product, quantity },
    })

    router.push("/cart")
  }

  return (
    <Layout title={product.title}>
      <div className="grid md:grid-cols-4 md:gap-3 bg-white rounded-xl p-10">
        <div className="md:col-span-2">
          <Image
            className="rounded-xl w-full h-auto"
            src={product.image}
            alt={product.title}
            width={340}
            height={340}
          />
        </div>

        <div>
          <div className="text-lg">
            <h2>{product.title}</h2>
            <p>{product.category}</p>
            <p>{product.description}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-2 flex justify-between">
            <div>Price:</div>
            <div>${product.price}</div>
          </div>
          <div className="flex justify-between">
            <div>Status:</div>
            <div>{product.count > 0 ? "Available" : "Unavailable"}</div>
          </div>
          <button
            onClick={addToCartHandler}
            className="rounded-xl bg-gray-700 text-white px-4 py-2 w-full mt-4"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { slug } = params

  await db.connect()
  const product = await Product.findOne({ slug }).lean()

  if (!product) {
    return { notFound: true }
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  }
}

export default ProductPage