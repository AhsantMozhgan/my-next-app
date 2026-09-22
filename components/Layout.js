import Head from "next/head"
import Link from "next/link"
import { useContext } from "react"
import { CartContext } from "../context/Cart"

function Layout({ title, children }) {
  const { state } = useContext(CartContext)
  const { cart } = state
  const count = cart.cartItems.reduce((acc, cur) => acc + cur.quantity, 0)

  return (
    <>
      <Head>
        <title>{`${title} - Shopping`}</title>
      </Head>
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-14 px-8 justify-between items-center border-b-4 bg-white">
            <Link href="/" className="text-lg font-bold">Shopping</Link>

            <div>
              <Link href="/cart" className="p-2">
                Cart
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                    {count}
                  </span>
                )}
              </Link>
              <Link href="/login" className="p-2">Login</Link>
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
