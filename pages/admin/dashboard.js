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

      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name}.
        </p>
      </div>

      {loading && (
        <p className="text-gray-500">Loading summary…</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-100 p-3 text-red-700">
          Error: {error}
        </p>
      )}

      {summary && (
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Orders"
            value={summary.ordersCount}
            accent="blue"
            icon="🧾"
            href="/admin/orders"
          />
          <StatCard
            label="Products"
            value={summary.productsCount}
            accent="green"
            icon="📦"
            href="/admin/products"
          />
          <StatCard
            label="Users"
            value={summary.usersCount}
            accent="purple"
            icon="👤"
            href="/admin/users"
          />
          <StatCard
            label="Total Sales"
            value={`$${summary.ordersPrice.toFixed(2)}`}
            accent="amber"
            icon="💰"
            href="/admin/orders"
          />
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold">Manage</h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link
          href="/admin/products"
          className="group rounded-xl bg-white p-6 transition hover:shadow-lg"
        >
          <h3 className="mb-2 text-lg font-semibold group-hover:text-blue-600">
            Products
          </h3>
          <p className="text-sm text-gray-600">
            Manage products: add, edit, delete
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="group rounded-xl bg-white p-6 transition hover:shadow-lg"
        >
          <h3 className="mb-2 text-lg font-semibold group-hover:text-blue-600">
            Orders
          </h3>
          <p className="text-sm text-gray-600">
            View and manage customer orders
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="group rounded-xl bg-white p-6 transition hover:shadow-lg"
        >
          <h3 className="mb-2 text-lg font-semibold group-hover:text-blue-600">
            Users
          </h3>
          <p className="text-sm text-gray-600">
            Manage registered users
          </p>
        </Link>
      </div>
    </Layout>
  )
}

function StatCard({ label, value, accent, icon, href }) {
  const accentClasses = {
    blue: "border-blue-500 text-blue-600",
    green: "border-green-500 text-green-600",
    purple: "border-purple-500 text-purple-600",
    amber: "border-amber-500 text-amber-600",
  }

  const cls = accentClasses[accent] || accentClasses.blue

  return (
    <Link
      href={href}
      className={`rounded-xl border-l-4 bg-white p-5 transition hover:shadow-lg ${cls}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-600">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${cls.split(" ")[1]}`}>{value}</p>
    </Link>
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