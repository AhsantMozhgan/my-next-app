import Link from "next/link"
import Layout from "../components/Layout"

function OrderCompletedPage() {
  return (
    <Layout title="Order Completed">
      <div className="mx-auto max-w-md bg-white rounded-xl p-8 text-center">
        <div className="text-5xl">✅</div>

        <h1 className="mt-4 mb-2 text-2xl font-bold">
          Thank you for your order!
        </h1>

        <p className="mb-6 text-gray-600">
          Your order has been placed successfully.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/order-history"
            className="rounded-xl bg-gray-700 px-4 py-2 text-white"
          >
            View Order History
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-gray-400 px-4 py-2 text-gray-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default OrderCompletedPage