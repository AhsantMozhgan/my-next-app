// components/ProductItem.js
import Link from "next/link"
import Image from "next/image"
import { useContext } from "react"
import { useRouter } from "next/router"
import { Store } from "../context/Cart"

function ProductItem({ item }) {
  const { state, dispatch } = useContext(Store)
  const router = useRouter()

  function addToCartHandler() {
    const existingItem = state.cart.cartItems.find((x) => x.slug === item.slug)
    const quantity = existingItem ? existingItem.quantity + 1 : 1

    if (item.count < quantity) {
      alert("Sorry. Product is out of stock")
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity },
    })

    router.push("/cart")
  }

  return (
    <div className="bg-white rounded-xl mb-5 block">
      <Link href={`/product/${item.slug}`}>
        <Image
          src={item.image}
          alt={item.title}
          width={400}
          height={400}
          className="rounded-t-xl"
        />
      </Link>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${item.slug}`}>
          <h2 className="text-lg">{item.title}</h2>
        </Link>

        <p className="p-2">${item.price}</p>

        <button
          onClick={addToCartHandler}
          className="rounded-xl bg-gray-700 text-white px-4 py-2"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductItem