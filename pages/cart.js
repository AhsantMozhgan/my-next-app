import Link from "next/link"
import Image from "next/image"
import { useContext } from "react"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import { Store } from "../context/Cart"

function CartPage() {
  const { state, dispatch } = useContext(Store)
  const { cartItems } = state.cart
  const router = useRouter()

  const removeItemHandler = (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: item })
  }

  const checkoutHandler = () => {
    router.push("/shipping")
  }

  if (cartItems.length === 0) {
    return (
      <Layout title="Shopping Cart">
        <div className="bg-white rounded-xl p-10">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/" className="text-blue-600 underline">
            Go shopping
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Shopping Cart">
      <div className="bg-white rounded-xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2">Item</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map((item) => (
              <tr key={item.slug} className="border-b">
                <td className="py-4">
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                    <span>{item.title}</span>
                  </Link>
                </td>

                <td className="py-4">{item.quantity}</td>

                <td className="py-4">${item.price}</td>

                <td className="py-4">
                  <button
                    onClick={() => removeItemHandler(item)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-between text-lg font-semibold">
          <div>Total Price:</div>
          <div>
            $
            {cartItems.reduce(
              (acc, item) => acc + item.quantity * item.price,
              0
            )}
          </div>
        </div>

        <button
          onClick={checkoutHandler}
          className="mt-4 rounded-xl bg-gray-700 px-4 py-2 text-white"
        >
          Checkout
        </button>

        <div className="mt-6">
          <Link
            href="/"
            className="rounded-xl bg-gray-700 px-4 py-2 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default CartPage