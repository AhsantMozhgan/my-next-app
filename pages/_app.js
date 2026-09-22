import "../styles/globals.css";

import { StoreProvider } from "../context/Cart";

 function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gray-100">
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </div>
  )
}

export default MyApp
