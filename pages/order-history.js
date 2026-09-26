import { useEffect, useState, useContext } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import Layout from "../components/Layout"

function OrderHistoryPage() {
  const router = useRouter()
  const { status } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login?redirect=/order-history")
      return
    }

    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders/history")

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [status, router])

  if (loading) {
    return (
      <Layout title="Order History">
        <p>Loading…</p>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Order History">
        <p className="text-red-600">Error: {error}</p>
      </Layout>
    )
  }

  if (orders.length === 0) {
    return (
      <Layout title="Order History">
        <h1 className="mb-4 text-xl font-bold">Order History</h1>
        <div className="bg-white rounded-xl p-6">
          <p className="mb-4">You have no orders yet.</p>
          <Link href="/" className="text-blue-600 underline">
            Go shopping
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-xl font-bold">Order History</h1>

      <div className="bg-white rounded-xl p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm font-bold text-gray-600">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Paid</th>
              <th className="pb-2">Delivered</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3 font-mono text-xs">
                  {order._id.slice(-8)}
                </td>

                <td className="py-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="py-3">${order.totalPrice}</td>

                <td className="py-3">
                  {order.isPaid ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>

                <td className="py-3">
                  {order.isDelivered ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>

                <td className="py-3">
                  <Link
                    href={`/order/${order._id}`}
                    className="rounded-xl bg-gray-700 px-3 py-1 text-sm text-white"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default OrderHistoryPage

OrderHistoryPage.auth = true