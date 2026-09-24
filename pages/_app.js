import "../styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import { SessionProvider } from "next-auth/react"
import { StoreProvider } from "../context/Cart"

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <div className="bg-gray-100">
      <SessionProvider session={session}>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </SessionProvider>
      <ToastContainer position="top-right" limit={1} autoClose={3000} />
    </div>
  )
}