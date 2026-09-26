import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import Layout from "../../components/Layout"
import AdminMenu from "../../components/AdminMenu"
import { authOptions } from "../api/auth/[...nextauth]"

function DashboardPage() {
  const { data: session } = useSession()

  const [summary, setSummary] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/admin/summary")

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setSummary(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  return (
    <Layout title="Admin Dashboard">
      <AdminMenu />

      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <p className="mb-6 text-gray-600">
        Welcome back, {session?.user?.name}.
      </p>

      {loading && <p>Loading summary…</p>}

      {error && <p className="text-red-600">Error: {error}</p>}

      {summary && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4 mb-6">
          <div className="bg-white rounded-xl p-6">
            <p className="mb-2 text-sm font-bold text-gray-600">Orders</p>
            <p className="text-2xl font-bold">{summary.ordersCount}</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <p className="mb-2 text-sm font-bold text-gray-600">Products</p>
            <p className="text-2xl font-bold">{summary.productsCount}</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <p className="mb-2 text-sm font-bold text-gray-600">Users</p>
            <p className="text-2xl font-bold">{summary.usersCount}</p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <p className="mb-2 text-sm font-bold text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold">${summary.ordersPrice}</p>
          </div>
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold">Manage</h2>

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

DashboardPage.auth = { adminOnly: true }

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/admin/dashboard",
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