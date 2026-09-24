import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"
import Layout from "../components/Layout"
import CheckoutWizard from "../components/CheckoutWizard"
import { Store } from "../context/Cart"

function PaymentPage() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress, paymentMethod },
  } = state

  // no shipping address → back to /shipping
  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push("/shipping")
    }
  }, [shippingAddress, router])

  const methods = [
    { value: "CashOnDelivery", label: "Cash on Delivery" },
    { value: "PayPal", label: "PayPal" },
    { value: "Stripe", label: "Stripe" },
  ]

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { paymentMethod: paymentMethod || "CashOnDelivery" },
  })

  const submitHandler = ({ paymentMethod }) => {
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod })
    Cookies.set("paymentMethod", paymentMethod, { expires: 7 })
    router.push("/placeorder")
  }

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-md bg-white rounded-xl p-6"
      >
        <h1 className="mb-6 text-xl font-bold">Payment Method</h1>

        <div className="mb-4 space-y-3">
          {methods.map((method) => (
            <label
              key={method.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                value={method.value}
                {...register("paymentMethod", {
                  required: "Please select a payment method",
                })}
              />
              {method.label}
            </label>
          ))}
        </div>

        {errors.paymentMethod && (
          <p className="mb-4 text-sm text-red-600">
            {errors.paymentMethod.message}
          </p>
        )}

        <div className="mb-4 flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/shipping")}
            className="rounded-xl bg-gray-300 text-gray-700 px-4 py-2 w-28"
          >
            Back
          </button>

          <button className="rounded-xl bg-gray-700 text-white px-4 py-2 w-28">
            Next
          </button>
        </div>
      </form>
    </Layout>
  )
}

export default PaymentPage

PaymentPage.auth = true