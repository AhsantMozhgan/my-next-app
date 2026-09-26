import { useEffect, useState } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import Layout from "../../components/Layout"
import AdminMenu from "../../components/AdminMenu"
import { authOptions } from "../api/auth/[...nextauth]"

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/admin/orders")

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
  }, [])

  return (
    <Layout title="Admin Orders">
      <AdminMenu />

      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      {loading && <p className="text-gray-500">Loading orders…</p>}

      {error && (
        <p className="rounded-lg bg-red-100 p-3 text-red-700">
          Error: {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-white rounded-xl p-6">
          <p>No orders yet.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="bg-white rounded-xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-bold text-gray-600">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">User</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Payment Method</th>
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
                    {order.user?.name || "Unknown"}
                    <div className="text-xs text-gray-500">
                      {order.user?.email || ""}
                    </div>
                  </td>

                  <td className="py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3">
                    {order.paymentMethod || "—"}
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
      )}
    </Layout>
  )
}

export default AdminOrdersPage

AdminOrdersPage.auth = { adminOnly: true }

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/admin/orders",
        permanent: false,
      },
    }
  }

  if (!session.user.isAdmin) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    }
  }

  return { props: {} }
}