import Head from "next/head"
import Link from "next/link"
import { useContext, useSyncExternalStore } from "react"
import { useSession, signOut } from "next-auth/react"
import { Store } from "../context/Cart"

// tiny helper: returns false on server, true on client
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function Layout({ title, children }) {
  const { state } = useContext(Store)
  const { cart } = state
  const count = cart.cartItems.reduce((acc, cur) => acc + cur.quantity, 0)

  const { status, data: session } = useSession()
  const mounted = useMounted()

  return (
    <>
      <Head>
        <title>{`${title} - Shopping`}</title>
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-14 px-8 justify-between items-center border-b-4 bg-white">
            <Link href="/" className="text-lg font-bold">Shopping</Link>

            <div className="flex items-center gap-4">
              <Link href="/cart" className="p-2">
                Cart
                {mounted && count > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                    {count}
                  </span>
                )}
              </Link>

              {status === "loading" ? (
                <span className="p-2 text-sm text-gray-400">…</span>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{session.user.name}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded bg-gray-700 px-3 py-1 text-sm text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="p-2">Login</Link>
              )}
            </div>
          </nav>
        </header>

        <main className="container m-auto mt-4 px-4">{children}</main>

        <footer className="flex justify-center items-center h-10">Footer</footer>
      </div>
    </>
  )
}

export default Layout