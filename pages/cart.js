// import Link from "next/link"
// import Image from "next/image"
import { useContext } from "react"
import { Store } from "../context/Cart"
import Layout from "../components/Layout"

function CartPage() {
  const { state, dispatch } = useContext(Store)
  const { cart: {cartItems} } = state

    return (
      <Layout title="Shopping Cart">
        <h1 className="mb-4 text-xl">Shopping Cart</h1>
        {cartItems.length === 0 ? <div>Cart is empty!</div> : <div></div>}
      </Layout>
    )
}

export default CartPage
