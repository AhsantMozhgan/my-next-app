import Link from "next/link"
import { useSession } from "next-auth/react"
import Layout from "../../components/Layout"

function DashboardPage() {
  const { data: session } = useSession()

  return (
    <Layout title="Admin Dashboard">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <p className="mb-6 text-gray-600">
        Welcome back, {session?.user?.name}.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl p-6 hover:shadow-lg"
        >
          <h2 className="mb-2 text-lg font-semibold">Products</h2>
          <p className="text-sm text-gray-600">
            Manage products: add, edit, delete
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl p-6 hover:shadow-lg"
        >
          <h2 className="mb-2 text-lg font-semibold">Orders</h2>
          <p className="text-sm text-gray-600">
            View and manage customer orders
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-xl p-6 hover:shadow-lg"
        >
          <h2 className="mb-2 text-lg font-semibold">Users</h2>
          <p className="text-sm text-gray-600">
            Manage registered users
          </p>
        </Link>
      </div>
    </Layout>
  )
}

export default DashboardPage

// admin-only protection
DashboardPage.auth = { adminOnly: true }