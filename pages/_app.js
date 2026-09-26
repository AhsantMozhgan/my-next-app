import "../styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"
import { ToastContainer } from "react-toastify"
import { SessionProvider, useSession } from "next-auth/react"
import { StoreProvider } from "../context/Cart"

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <div className="bg-gray-100">
      <SessionProvider session={session}>
        <StoreProvider>
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </StoreProvider>
      </SessionProvider>
      <ToastContainer position="top-right" limit={1} autoClose={3000} />
    </div>
  )
}

function Auth({ children, adminOnly }) {
  const router = useRouter()
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized")
    },
  })

  if (status === "loading") {
    return <div className="p-10 text-center">Loading…</div>
  }

  if (adminOnly && !session?.user?.isAdmin) {
    router.push("/unauthorized")
    return null
  }

  return children
}