import { getServerSession } from "next-auth/next"
import Layout from "../../components/Layout"
import AdminMenu from "../../components/AdminMenu"
import { authOptions } from "../api/auth/[...nextauth]"

function AdminProductsPage() {
  return (
    <Layout title="Admin Products">
      <AdminMenu />

      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <div className="bg-white rounded-xl p-6">
        <p>Product management — coming next.</p>
      </div>
    </Layout>
  )
}

export default AdminProductsPage

AdminProductsPage.auth = { adminOnly: true }

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/admin/products",
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