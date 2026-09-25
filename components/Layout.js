import Head from "next/head"
import Link from "next/link"
import { useContext, useSyncExternalStore } from "react"
import { useSession, signOut } from "next-auth/react"
import Cookies from "js-cookie"
import { Store } from "../context/Cart"
import Dropdown from "./DropDown"

// false on server, true on client — avoids hydration mismatch
function useMounted() {
  return useSyncExternalStore(
    () => () => {},     // No store to subscribe to
    () => true,         // On the client, we're mounted
    () => false         // On the server, we're not
  )
}

// const mounted = useSyncExternalStore(
//   () => () => {},
//   () => true,
//   () => false
// )

// {mounted && count > 0 && <span>{count}</span>}

function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const count = cart.cartItems.reduce((acc, cur) => acc + cur.quantity, 0)

  const { status, data: session } = useSession()
  const mounted = useMounted()

  const handleLogout = () => {
    dispatch({ type: "CART_CLEAR" })
    Cookies.remove("cart")
    Cookies.remove("shippingAddress")
    Cookies.remove("paymentMethod")
    signOut({ callbackUrl: "/" })
  }

  const userMenuItems = [
    { href: "/profile", label: "Profile" },
    { href: "/order-history", label: "Order History" },
    { label: "Logout", onClick: handleLogout },
  ]

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
                <Dropdown label={session.user.name} items={userMenuItems} />
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