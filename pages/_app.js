import "../styles/globals.css"
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
    </div>
  )
}