import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import Cookies from "js-cookie"
import Layout from "../components/Layout"
import CheckoutWizard from "../components/CheckoutWizard"
import { Store } from "../context/Cart"

function PlaceOrderPage() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state

  // guards
  useEffect(() => {
    if (!cartItems.length) return router.push("/")
    if (!shippingAddress?.address) return router.push("/shipping")
    if (!paymentMethod) return router.push("/payment")
  }, [cartItems, shippingAddress, paymentMethod, router])

  // price calculations
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100
  const itemsPrice = round2(
    cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
  )
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  const placeOrderHandler = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        alert(data.message || "Failed to place order")
        return
      }

      dispatch({ type: "CART_CLEAR" })
      Cookies.remove("cart")
      Cookies.remove("shippingAddress")
      Cookies.remove("paymentMethod")

      router.push(`/order/${data._id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />

      <h1 className="mb-4 text-xl font-bold">Place Order</h1>

      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-5 mb-4">
            <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
            <p>
              {shippingAddress?.fullName}, {shippingAddress?.address},{" "}
              {shippingAddress?.city}, {shippingAddress?.postalCode},{" "}
              {shippingAddress?.country}
            </p>
            <Link href="/shipping" className="text-blue-600 underline text-sm">
              Edit
            </Link>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-5 mb-4">
            <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
            <p>{paymentMethod}</p>
            <Link href="/payment" className="text-blue-600 underline text-sm">
              Edit
            </Link>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="mb-2 text-lg font-semibold">Order Items</h2>
            <table className="w-full"><thead>
                <tr className="border-b text-left text-sm text-gray-600">
                    <th className="mb-2 text-lg font-semibold">Item</th>
                    <th className="mb-2 text-lg font-semibold">Quantity</th>
                    <th className="mb-2 text-lg font-semibold">Price</th>
                    <th className="mb-2 text-lg font-semibold">Subtotal</th>
                </tr>
                </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td className="py-3">
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center gap-3"
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
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">${item.price}</td>
                    <td className="py-3">${item.quantity * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/cart" className="text-blue-600 underline text-sm">
              Edit
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-5 md:sticky md:top-4 h-fit">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

          <div className="flex justify-between mb-1">
            <span>Items</span>
            <span>${itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shipping</span>
            <span>${shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tax</span>
            <span>${taxPrice}</span>
          </div>
          <div className="flex justify-between mb-4 font-semibold border-t pt-2">
            <span className="text-lg">Total</span>
            <span>${totalPrice}</span>
          </div>

          <button
            onClick={placeOrderHandler}
            className="w-full rounded-xl bg-gray-700 px-4 py-2 text-white"
          >
            Place Order
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default PlaceOrderPage

PlaceOrderPage.auth = true