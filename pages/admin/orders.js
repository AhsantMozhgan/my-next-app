import { getServerSession } from "next-auth/next"
import Layout from "../../components/Layout"
import AdminMenu from "../../components/AdminMenu"
import { authOptions } from "../api/auth/[...nextauth]"

function AdminOrdersPage() {
  return (
    <Layout title="Admin Orders">
      <AdminMenu />

      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      <div className="bg-white rounded-xl p-6">
        <p>Order management — coming next.</p>
      </div>
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