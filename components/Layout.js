import Head from "next/head"
import Link from "next/link"
import { useContext, useSyncExternalStore } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Store } from "../context/Cart"

// false on server, true on client — no useEffect, no warning
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
                <Menu>
                  <MenuButton className="rounded bg-gray-700 px-3 py-1 text-sm text-white data-active:bg-gray-800">
                    {session.user.name}
                  </MenuButton>
                  </Menu>

                  // <MenuItems
                  //   anchor="bottom end"
                  //   className="mt-1 w-52 rounded-lg bg-white p-1 shadow-lg [--anchor-gap:4px]"
                  // >
                  //   <MenuItem>
                  //     <Link
                  //       href="/profile"
                  //       className="block rounded px-3 py-2 text-sm data-focus:bg-gray-100"
                  //     >
                  //       Profile
                  //     </Link>
                  //   </MenuItem>

                  //   <MenuItem>
                  //     <Link
                  //       href="/order-history"
                  //       className="block rounded px-3 py-2 text-sm data-focus:bg-gray-100"
                  //     >
                  //       Order History
                  //     </Link>
                  //   </MenuItem>

                  //   <MenuItem>
                  //     <button
                  //       onClick={() => signOut({ callbackUrl: "/" })}
                  //       className="block w-full rounded px-3 py-2 text-left text-sm data-focus:bg-gray-100"
                  //     >
                  //       Logout
                  //     </button>
                  //   </MenuItem>
                  // </MenuItems>
                // </Menu>
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