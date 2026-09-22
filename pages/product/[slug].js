import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import productItems from "../../data/products.json"
import Image from "next/image"
import { useContext } from "react"
import { CartContext } from "../../context/Cart"

function ProductPage() {
  const { state, dispatch } = useContext(CartContext)
  const { query } = useRouter()
  const { slug } = query

  const product = productItems.find((pItem) => pItem.slug === slug)
  if (!product) return <div>Product not found.</div>

  function addToCartHandler() {
    const existingItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    )
    const quantity = existingItem ? existingItem.quantity + 1 : 1

    if (product.count < quantity) {
      alert("Sorry. Product is out of stock")
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: { ...product, quantity },
    })
  }

  return (
    <Layout title={product.title}>
      <div className="grid md:grid-cols-4 md:gap-3 bg-white rounded-xl p-10">
        <div className="md:col-span-2">
          <Image
            className="rounded-xl w-full h-auto"
            src={product.image}
            width={340}
            height={340}
            alt={product.title}
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
          <button onClick={addToCartHandler} className="rounded-xl bg-gray-700 text-white px-4 py-2 w-full">
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ProductPage