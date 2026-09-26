import { getServerSession } from "next-auth/next"
import Layout from "../../components/Layout"
import AdminMenu from "../../components/AdminMenu"
import { authOptions } from "../api/auth/[...nextauth]"

function AdminUsersPage() {
  return (
    <Layout title="Admin Users">
      <AdminMenu />

      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      <div className="bg-white rounded-xl p-6">
        <p>User management — coming next.</p>
      </div>
    </Layout>
  )
}

export default AdminUsersPage

AdminUsersPage.auth = { adminOnly: true }

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/login?redirect=/admin/users",
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