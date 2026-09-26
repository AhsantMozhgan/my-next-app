import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import Layout from "../components/Layout"
import CheckoutWizard from "../components/CheckoutWizard"
import { Store } from "../context/Cart"

function PaymentPage() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress, paymentMethod },
  } = state

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod || ""
  )

  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push("/shipping")
    }
  }, [shippingAddress, router])

  const methods = ["CashOnDelivery", "PayPal", "Stripe"]

  const submitHandler = (event) => {
    event.preventDefault()

    if (!selectedPaymentMethod) {
      alert("Please select a payment method")
      return
    }

    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod })
    Cookies.set("paymentMethod", selectedPaymentMethod, {
      expires: 7,
      path: "/",
    })
    router.push("/placeorder")
  }

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />

      <form
        onSubmit={submitHandler}
        className="mx-auto max-w-md bg-white rounded-xl p-6"
      >
        <h1 className="mb-6 text-xl font-bold">Payment Method</h1>

        <div className="mb-4 space-y-3">
          {methods.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={item}
                checked={selectedPaymentMethod === item}
                onChange={() => setSelectedPaymentMethod(item)}
              />
              {item}
            </label>
          ))}
        </div>

        <div className="mb-4 flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/shipping")}
            className="rounded-xl bg-gray-300 text-gray-700 px-4 py-2 w-28"
          >
            Back
          </button>

          <button
            type="submit"
            className="rounded-xl bg-gray-700 text-white px-4 py-2 w-28"
          >
            Next
          </button>
        </div>
      </form>
    </Layout>
  )
}

export default PaymentPage

PaymentPage.auth = true